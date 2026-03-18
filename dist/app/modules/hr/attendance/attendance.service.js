"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceService = exports.AttendanceService = void 0;
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
const organization_dal_1 = require("../../../../shared/dal/organization.dal");
const shiftHelper_1 = require("../../../../shared/utils/shiftHelper");
const haversine_1 = require("../../../../shared/utils/haversine");
const azureFace_1 = require("../../../../shared/utils/azureFace");
class AttendanceService {
    pickUserId(value) {
        const raw = value?._id || value?.id || value;
        if (!raw)
            return '';
        if (typeof raw === 'string')
            return raw.match(/[a-f\d]{24}/i)?.[0] || '';
        if (typeof raw === 'object' && typeof raw.toString === 'function')
            return raw.toString().match(/[a-f\d]{24}/i)?.[0] || '';
        return '';
    }
    /**
     * Mark attendance with Zero-Trust Validation
     */
    async markAttendance(attendanceData) {
        const userId = this.pickUserId(attendanceData.userId);
        if (!userId)
            throw new Error('User ID is required');
        const data = { ...attendanceData, userId };
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.organizationId) {
            throw new Error('Organization not set for user');
        }
        const organization = await organization_dal_1.OrganizationDAL.findById(user.organizationId.toString());
        if (!organization) {
            throw new Error('Organization not found');
        }
        // Zero-Trust Validation Sequence
        await this.validateAttendance(data, user, organization);
        // Check if attendance record exists for today
        let attendance = await attendance_dal_1.attendanceDAL.findByUserAndDate(userId, new Date(data.date));
        const shiftTime = user.professionalDetails?.shiftTime;
        if (!shiftTime) {
            throw new Error('Shift time not configured for user');
        }
        if (!attendance) {
            // --- CHECK-IN ---
            const checkInTime = data.checkInTime || new Date();
            const lateCheck = shiftHelper_1.ShiftHelper.isLate(new Date(checkInTime), shiftTime);
            attendance = await attendance_dal_1.attendanceDAL.create({
                ...data,
                checkInTime,
                isLate: lateCheck.isLate,
                lateByMinutes: lateCheck.lateByMinutes,
                status: data.status || 'PRESENT',
                isApproved: false
            });
            return { type: 'CHECK_IN', attendance };
        }
        else {
            // --- CHECK-OUT ---
            if (attendance.checkOutTime) {
                throw new Error('Already checked out for today');
            }
            const checkOutTime = data.checkOutTime || new Date();
            const earlyExitCheck = shiftHelper_1.ShiftHelper.isEarlyExit(new Date(checkOutTime), shiftTime);
            // Calculate working hours
            const workingHours = shiftHelper_1.ShiftHelper.calculateWorkingHours(new Date(attendance.checkInTime), new Date(checkOutTime));
            const overtimeHours = shiftHelper_1.ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);
            const updatedAttendance = await attendance_dal_1.attendanceDAL.update(attendance._id.toString(), {
                checkOutTime,
                earlyExit: earlyExitCheck.earlyExit,
                earlyExitByMinutes: earlyExitCheck.earlyExitByMinutes,
                workingHours,
                overtimeHours,
                gpsLatitude: data.gpsLatitude,
                gpsLongitude: data.gpsLongitude,
                remarks: data.remarks || attendance.remarks
            });
            return { type: 'CHECK_OUT', attendance: updatedAttendance };
        }
    }
    /**
     * Register Device & Face (One-time setup)
     */
    async registerDevice(registrationData) {
        const user = await user_dal_1.userDAL.findById(registrationData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // 1. Azure Face Enrollment
        // We use the organization ID as the personGroupId
        const personGroupId = user.organizationId.toString();
        const azurePersonId = await azureFace_1.AzureFaceService.enrollPerson(personGroupId, user.getFullName(), registrationData.selfie);
        // 2. Hardware Lock & Update Flags
        user.registeredDeviceId = registrationData.deviceId;
        user.azurePersonId = azurePersonId;
        await user.save({ validateBeforeSave: false });
        return {
            message: 'Device and face registered successfully',
            registeredDeviceId: user.registeredDeviceId,
            isFaceRegistered: true
        };
    }
    /**
     * Helper to perform multi-layered validation
     */
    async validateAttendance(attendanceData, user, organization) {
        const securitySettings = organization.settings?.securitySettings;
        // 1. Device ID Lock
        if (!user.registeredDeviceId) {
            // First time registration (auto-lock if not already locked)
            // Note: Typically you'd use the registration endpoint, 
            // but we allow auto-lock on first mark if not yet set.
            user.registeredDeviceId = attendanceData.deviceId;
            await user.save({ validateBeforeSave: false });
        }
        else if (user.registeredDeviceId !== attendanceData.deviceId) {
            const error = new Error('Unauthorized device. Please use your registered device.');
            error.statusCode = 403;
            throw error;
        }
        // 2. Mock GPS Block
        if (securitySettings?.blockMockLocations && attendanceData.isMockLocation) {
            const error = new Error('Mock location detected. Please disable mock GPS.');
            error.statusCode = 403;
            throw error;
        }
        // 3. Geofence Re-verification (Haversine)
        if (attendanceData.status !== 'WFH') {
            const officeLocations = securitySettings?.officeLocations || [];
            if (officeLocations.length > 0) {
                let isWithinRange = false;
                let minDistance = Infinity;
                for (const loc of officeLocations) {
                    const distance = haversine_1.Haversine.calculateDistance(attendanceData.gpsLatitude, attendanceData.gpsLongitude, loc.latitude, loc.longitude);
                    if (distance <= loc.radius) {
                        isWithinRange = true;
                        break;
                    }
                    if (distance < minDistance)
                        minDistance = distance;
                }
                if (!isWithinRange) {
                    const error = new Error(`Outside geofence. Nearest office is ${Math.round(minDistance)}m away.`);
                    error.statusCode = 403;
                    throw error;
                }
            }
        }
        // 4. BSSID Verification (Optional)
        const allowedWifis = securitySettings?.allowedWifiNetworks || [];
        if (allowedWifis.length > 0 && attendanceData.wifiBSSID) {
            const isAllowedWifi = allowedWifis.some((w) => w.bssid === attendanceData.wifiBSSID);
            if (!isAllowedWifi) {
                const error = new Error('Unauthorized WiFi network.');
                error.statusCode = 403;
                throw error;
            }
        }
        // 5. Selfie Verification (Azure Face API)
        if (securitySettings?.requireFaceCapture) {
            if (!attendanceData.selfie) {
                const error = new Error('Selfie is required for attendance.');
                error.statusCode = 400;
                throw error;
            }
            if (user.azurePersonId) {
                // Detect face from selfie
                const faceId = await azureFace_1.AzureFaceService.detectFace(attendanceData.selfie);
                // Verify against registered person
                const isIdentical = await azureFace_1.AzureFaceService.verifyFace(faceId, user.azurePersonId, user.organizationId.toString());
                if (!isIdentical) {
                    const error = new Error('Face verification failed. Record does not match.');
                    error.statusCode = 401;
                    throw error;
                }
            }
            else {
                // Option: Require registration first if policy says so
                const error = new Error('Face not registered. Please register your device and face first.');
                error.statusCode = 400;
                throw error;
            }
        }
    }
    /**
     * Get attendance by ID
     */
    async getAttendanceById(id) {
        const attendance = await attendance_dal_1.attendanceDAL.findById(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        return attendance;
    }
    /**
     * Get all attendance records
     */
    async getAllAttendance(filters, options) {
        return await attendance_dal_1.attendanceDAL.findAll(filters, options);
    }
    /**
     * Update attendance
     */
    async updateAttendance(id, updateData) {
        const attendance = await attendance_dal_1.attendanceDAL.findById(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        // Get user for shift time
        const attendanceUserId = this.pickUserId(attendance.userId);
        if (!attendanceUserId) {
            throw new Error('Invalid attendance userId');
        }
        const user = await user_dal_1.userDAL.findById(attendanceUserId);
        if (!user || !user.professionalDetails.shiftTime) {
            throw new Error('Shift time not configured');
        }
        const shiftTime = user.professionalDetails.shiftTime;
        // Recalculate if times are updated
        if (updateData.checkInTime || updateData.checkOutTime) {
            const checkInTime = new Date(updateData.checkInTime || attendance.checkInTime);
            const checkOutTime = updateData.checkOutTime ? new Date(updateData.checkOutTime) : null;
            // Recalculate late status
            const lateCheck = shiftHelper_1.ShiftHelper.isLate(checkInTime, shiftTime);
            updateData.isLate = lateCheck.isLate;
            updateData.lateByMinutes = lateCheck.lateByMinutes;
            // Recalculate working hours and overtime if checkout exists
            if (checkOutTime) {
                const earlyExitCheck = shiftHelper_1.ShiftHelper.isEarlyExit(checkOutTime, shiftTime);
                updateData.earlyExit = earlyExitCheck.earlyExit;
                updateData.earlyExitByMinutes = earlyExitCheck.earlyExitByMinutes;
                updateData.workingHours = shiftHelper_1.ShiftHelper.calculateWorkingHours(checkInTime, checkOutTime);
                updateData.overtimeHours = shiftHelper_1.ShiftHelper.calculateOvertimeHours(updateData.workingHours, shiftTime);
            }
        }
        return await attendance_dal_1.attendanceDAL.update(id, updateData);
    }
    /**
     * Delete attendance
     */
    async deleteAttendance(id) {
        const attendance = await attendance_dal_1.attendanceDAL.delete(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        return attendance;
    }
    /**
     * Upsert attendance for a user by HR (no device/geo/face checks)
     * - If record exists for given user + date -> update it
     * - If not -> create a new record
     */
    async upsertAttendanceByAdmin(payload) {
        const userId = this.pickUserId(payload.userId);
        if (!userId)
            throw new Error('User ID is required');
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const shiftTime = user.professionalDetails?.shiftTime;
        if (!shiftTime) {
            throw new Error('Shift time not configured for user');
        }
        const targetDate = new Date(payload.date || new Date());
        const existing = await attendance_dal_1.attendanceDAL.findByUserAndDate(userId, targetDate);
        if (existing) {
            const updateData = {
                status: payload.status,
                shift: payload.shift,
                remarks: payload.remarks
            };
            if (payload.checkInTime) {
                updateData.checkInTime = new Date(payload.checkInTime);
            }
            if (payload.checkOutTime) {
                updateData.checkOutTime = new Date(payload.checkOutTime);
            }
            const updated = await this.updateAttendance(existing._id.toString(), updateData);
            return { attendance: updated, isNew: false };
        }
        const checkInTime = payload.checkInTime ? new Date(payload.checkInTime) : undefined;
        const checkOutTime = payload.checkOutTime ? new Date(payload.checkOutTime) : undefined;
        const lateCheck = checkInTime ? shiftHelper_1.ShiftHelper.isLate(checkInTime, shiftTime) : { isLate: false, lateByMinutes: 0 };
        let workingHours = 0;
        let overtimeHours = 0;
        if (checkInTime && checkOutTime) {
            workingHours = shiftHelper_1.ShiftHelper.calculateWorkingHours(checkInTime, checkOutTime);
            overtimeHours = shiftHelper_1.ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);
        }
        const created = await attendance_dal_1.attendanceDAL.create({
            userId,
            date: targetDate,
            status: payload.status,
            shift: payload.shift,
            checkInTime,
            checkOutTime,
            isLate: lateCheck.isLate,
            lateByMinutes: lateCheck.lateByMinutes,
            workingHours,
            overtimeHours,
            remarks: payload.remarks
        });
        return { attendance: created, isNew: true };
    }
    /**
     * Get today's attendance
     */
    async getTodayAttendance() {
        return await user_dal_1.userDAL.getTodayAttendanceOverview();
    }
    /**
     * Get user attendance report
     */
    async getUserAttendanceReport(userId, month, year) {
        const raw = await attendance_dal_1.attendanceDAL.getUserAttendanceStats(userId, month, year);
        const counts = (raw || []).reduce((acc, row) => {
            if (row?._id)
                acc[String(row._id)] = Number(row.count) || 0;
            return acc;
        }, {});
        return {
            present: (counts.PRESENT || 0) + (counts.LATE || 0),
            absent: counts.ABSENT || 0,
            wfh: counts.WFH || 0,
            onLeave: counts.ON_LEAVE || 0,
            late: counts.LATE || 0,
            halfDay: counts.HALF_DAY || 0
        };
    }
    /**
    * Get attendance by date range
    */
    async getAttendanceByDateRange(userId, startDate, endDate) {
        return await attendance_dal_1.attendanceDAL.findByUserAndDateRange(userId, startDate, endDate);
    }
    /**
     * Get today's attendance for a specific employee
     */
    async getEmployeeTodayAttendance(userId) {
        const today = new Date();
        const attendance = await attendance_dal_1.attendanceDAL.findByUserAndDate(userId, today);
        if (!attendance) {
            return null;
        }
        return attendance;
    }
}
exports.AttendanceService = AttendanceService;
exports.attendanceService = new AttendanceService();
//# sourceMappingURL=attendance.service.js.map