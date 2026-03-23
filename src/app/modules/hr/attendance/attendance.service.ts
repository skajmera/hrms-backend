import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { IAttendance, IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { userDAL } from '../../../../shared/dal/user.dal';
import { OrganizationDAL } from '../../../../shared/dal/organization.dal';
import { ShiftHelper } from '../../../../shared/utils/shiftHelper';
import { Haversine } from '../../../../shared/utils/haversine';
import { AzureFaceService } from '../../../../shared/utils/azureFace';
import { AttendanceModel } from '../../../../shared/models/attendance.model';

export class AttendanceService {
  private normalizeBssid(value: any): string {
    return String(value || '').trim().toLowerCase();
  }

  private pickUserId(value: any): string {
    const raw = value?._id || value?.id || value;
    if (!raw) return '';
    if (typeof raw === 'string') return raw.match(/[a-f\d]{24}/i)?.[0] || '';
    if (typeof raw === 'object' && typeof raw.toString === 'function') return raw.toString().match(/[a-f\d]{24}/i)?.[0] || '';
    return '';
  }
  /**
   * Mark attendance with Zero-Trust Validation
   */
  async markAttendance(attendanceData: IAttendanceCreateInput) {
    const userId = this.pickUserId((attendanceData as any).userId);
    if (!userId) throw new Error('User ID is required');

    const data: any = { ...attendanceData, userId };
    const clientRequestId = data.clientRequestId;
    const user = await userDAL.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.organizationId) {
      throw new Error('Organization not set for user');
    }

    const organization = await OrganizationDAL.findById(user.organizationId.toString());
    if (!organization) {
      throw new Error('Organization not found');
    }

    // Zero-Trust Validation Sequence
    await this.validateAttendance(data, user, organization);

    // Check if attendance record exists for today
    let attendance = await attendanceDAL.findByUserAndDate(
      userId,
      new Date(data.date)
    );

    const shiftTime = user.professionalDetails?.shiftTime;
    if (!shiftTime) {
      throw new Error('Shift time not configured for user');
    }

    if (!attendance) {
      // --- CHECK-IN ---
      const checkInTime = data.checkInTime || new Date();
      const lateCheck = ShiftHelper.isLate(new Date(checkInTime), shiftTime);

      try {
        attendance = await attendanceDAL.create({
          ...data,
          checkInTime,
          isLate: lateCheck.isLate,
          lateByMinutes: lateCheck.lateByMinutes,
          status: data.status || 'PRESENT',
          isApproved: false
        });
      } catch (err: any) {
        // Idempotency/race: if create happens twice concurrently, unique index may throw.
        const isDuplicate =
          err?.code === 11000 || String(err?.message || '').includes('E11000') || String(err?.message || '').includes('duplicate key');
        if (isDuplicate) {
          attendance = await attendanceDAL.findByUserAndDate(userId, new Date(data.date));
          if (attendance) {
            return { type: 'CHECK_IN', attendance };
          }
        }
        throw err;
      }
      return { type: 'CHECK_IN', attendance };
    } else {
      // --- CHECK-OUT ---
      if (attendance.checkOutTime) {
        if (clientRequestId && attendance.clientRequestId === clientRequestId) {
          return { type: 'CHECK_OUT', attendance };
        }
        throw new Error('Already checked out for today');
      }

      // Idempotency:
      // If clientRequestId matches the existing attendance, treat it as CHECK-IN replay (no-op),
      // preventing a duplicate check-in from being interpreted as check-out.
      if (clientRequestId && attendance.clientRequestId === clientRequestId) {
        return { type: 'CHECK_IN', attendance };
      }

      const checkOutTime = data.checkOutTime || new Date();
      const earlyExitCheck = ShiftHelper.isEarlyExit(new Date(checkOutTime), shiftTime);

      // Calculate working hours
      const workingHours = ShiftHelper.calculateWorkingHours(
        new Date(attendance.checkInTime!),
        new Date(checkOutTime)
      );

      const overtimeHours = ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);

      const updatedAttendance = await attendanceDAL.update(attendance._id.toString(), {
        checkOutTime,
        earlyExit: earlyExitCheck.earlyExit,
        earlyExitByMinutes: earlyExitCheck.earlyExitByMinutes,
        workingHours,
        overtimeHours,
        gpsLatitude: data.gpsLatitude,
        gpsLongitude: data.gpsLongitude,
        wifiBSSID: data.wifiBSSID,
        deviceId: data.deviceId,
        isMockLocation: data.isMockLocation,
        selfie: data.selfie,
        clientRequestId,
        remarks: data.remarks || attendance.remarks
      });

      return { type: 'CHECK_OUT', attendance: updatedAttendance };
    }
  }

  /**
   * Register Device & Face (One-time setup)
   */
  async registerDevice(registrationData: {
    userId: string;
    deviceId: string;
    selfie: string; // File path
    gpsLatitude?: number;
    gpsLongitude?: number;
    wifiBSSID?: string;
  }) {
    const user = await userDAL.findById(registrationData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 1. Azure Face Enrollment
    // We use the organization ID as the personGroupId
    const personGroupId = user.organizationId.toString();
    const azurePersonId = await AzureFaceService.enrollPerson(
      personGroupId,
      user.getFullName(),
      registrationData.selfie
    );

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
  private async validateAttendance(attendanceData: any, user: any, organization: any) {
    const securitySettings = organization.settings?.securitySettings;
    const requiresEnrollment = Boolean(securitySettings?.requiresEnrollment);
    const requireFaceCaptureEffective = Boolean(securitySettings?.requireFaceCapture || securitySettings?.isSelfieRequired);

    // 1. Device ID Lock
    if (!user.registeredDeviceId) {
      // Contract:
      // - requiresEnrollment=true => block until client calls register-device
      // - requiresEnrollment=false => allow first mark to bind device (legacy behavior)
      if (requiresEnrollment) {
        const error = new Error('DEVICE_ENROLLMENT_REQUIRED. Please register device first.');
        (error as any).statusCode = 400;
        throw error;
      }

      if (!attendanceData.deviceId) {
        const error = new Error('Device not registered. Please register device first.');
        (error as any).statusCode = 400;
        throw error;
      }

      user.registeredDeviceId = attendanceData.deviceId;
      await user.save({ validateBeforeSave: false });
    } else if (user.registeredDeviceId !== attendanceData.deviceId) {
      const error = new Error('Unauthorized device. Please use your registered device.');
      (error as any).statusCode = 403;
      throw error;
    }

    // 2. Mock GPS Block
    const isWFH = attendanceData.status === 'WFH';
    if (securitySettings?.blockMockLocations && attendanceData.isMockLocation && !isWFH) {
      const error = new Error('Mock location detected for office attendance.');
      (error as any).statusCode = 403;
      throw error;
    }

    // 3. Geofence Re-verification (Haversine)
    if (!isWFH) {
      const officeLocations = securitySettings?.officeLocations || [];
      if (officeLocations.length > 0) {
        let isWithinRange = false;
        let minDistance = Infinity;

        for (const loc of officeLocations) {
          const distance = Haversine.calculateDistance(
            attendanceData.gpsLatitude,
            attendanceData.gpsLongitude,
            loc.latitude,
            loc.longitude
          );
          if (distance <= loc.radius) {
            isWithinRange = true;
            break;
          }
          if (distance < minDistance) minDistance = distance;
        }

        if (!isWithinRange) {
          const error = new Error(`Outside geofence. Nearest office is ${Math.round(minDistance)}m away.`);
          (error as any).statusCode = 403;
          throw error;
        }
      }
    }

    // 4. BSSID Verification (Optional)
    const allowedWifis = securitySettings?.allowedWifiNetworks || [];
    if (!isWFH && allowedWifis.length > 0) {
      // For office attendance, Wi-Fi should be present and must be allowed.
      if (!attendanceData.wifiBSSID) {
        const error = new Error('wifiBSSID is required for office attendance.');
        (error as any).statusCode = 403;
        throw error;
      }

      const requestedBssid = this.normalizeBssid(attendanceData.wifiBSSID);
      const isAllowedWifi = allowedWifis.some((w: any) => this.normalizeBssid(w?.bssid) === requestedBssid);
      if (!isAllowedWifi) {
        const error = new Error('Unauthorized WiFi network.');
        (error as any).statusCode = 403;
        throw error;
      }
    }

    // 5. Selfie Verification (Azure Face API)
    if (requireFaceCaptureEffective) {
      if (!attendanceData.selfie) {
        const error = new Error('selfie is required for attendance.');
        (error as any).statusCode = 400;
        throw error;
      }

      if (user.azurePersonId) {
        // Detect face from selfie
        const faceId = await AzureFaceService.detectFace(attendanceData.selfie);

        // Verify against registered person
        const isIdentical = await AzureFaceService.verifyFace(
          faceId,
          user.azurePersonId,
          user.organizationId.toString()
        );

        if (!isIdentical) {
          const error = new Error('Face verification failed. Record does not match.');
          (error as any).statusCode = 401;
          throw error;
        }
      } else {
        // Option: Require registration first if policy says so
        const error = new Error('Face not registered. Please register your device and face first.');
        (error as any).statusCode = 400;
        throw error;
      }
    }
  }



  /**
   * Get attendance by ID
   */
  async getAttendanceById(id: string) {
    const attendance = await attendanceDAL.findById(id);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    return attendance;
  }

  /**
   * Get all attendance records
   */
  async getAllAttendance(filters: any, options: IPaginationOptions) {
    return await attendanceDAL.findAll(filters, options);
  }

  /**
   * Update attendance
   */
  async updateAttendance(id: string, updateData: any) {
    const attendance = await attendanceDAL.findById(id);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    // Get user for shift time
    const attendanceUserId = this.pickUserId(attendance.userId);
    if (!attendanceUserId) {
      throw new Error('Invalid attendance userId');
    }

    const user = await userDAL.findById(attendanceUserId);
    if (!user || !user.professionalDetails.shiftTime) {
      throw new Error('Shift time not configured');
    }

    const shiftTime = user.professionalDetails.shiftTime;

    // Recalculate if times are updated
    if (updateData.checkInTime || updateData.checkOutTime) {
      const checkInTime = new Date(updateData.checkInTime || attendance.checkInTime);
      const checkOutTime = updateData.checkOutTime ? new Date(updateData.checkOutTime) : null;

      // Recalculate late status
      const lateCheck = ShiftHelper.isLate(checkInTime, shiftTime);
      updateData.isLate = lateCheck.isLate;
      updateData.lateByMinutes = lateCheck.lateByMinutes;

      // Recalculate working hours and overtime if checkout exists
      if (checkOutTime) {
        const earlyExitCheck = ShiftHelper.isEarlyExit(checkOutTime, shiftTime);
        updateData.earlyExit = earlyExitCheck.earlyExit;
        updateData.earlyExitByMinutes = earlyExitCheck.earlyExitByMinutes;

        updateData.workingHours = ShiftHelper.calculateWorkingHours(checkInTime, checkOutTime);
        updateData.overtimeHours = ShiftHelper.calculateOvertimeHours(updateData.workingHours, shiftTime);
      }
    }

    return await attendanceDAL.update(id, updateData);
  }

  /**
   * Delete attendance
   */
  async deleteAttendance(id: string) {
    const attendance = await attendanceDAL.delete(id);
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
  async upsertAttendanceByAdmin(payload: {
    userId: string;
    date: string | Date;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'WFH' | 'ON_LEAVE';
    shift: string;
    checkInTime?: string | Date;
    checkOutTime?: string | Date;
    remarks?: string;
  }) {
    const userId = this.pickUserId((payload as any).userId);
    if (!userId) throw new Error('User ID is required');

    const user = await userDAL.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const shiftTime = user.professionalDetails?.shiftTime;
    if (!shiftTime) {
      throw new Error('Shift time not configured for user');
    }

    const targetDate = new Date(payload.date || new Date());

    const existing = await attendanceDAL.findByUserAndDate(userId, targetDate);

    if (existing) {
      const updateData: any = {
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

    const lateCheck = checkInTime ? ShiftHelper.isLate(checkInTime, shiftTime) : { isLate: false, lateByMinutes: 0 };

    let workingHours = 0;
    let overtimeHours = 0;

    if (checkInTime && checkOutTime) {
      workingHours = ShiftHelper.calculateWorkingHours(checkInTime, checkOutTime);
      overtimeHours = ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);
    }

    const created = await attendanceDAL.create({
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
    } as any);

    return { attendance: created, isNew: true };
  }

  /**
   * Get today's attendance
   */
  async getTodayAttendance(organizationId?: string) {
    return await userDAL.getTodayAttendanceOverview(organizationId);
  }

  /**
   * Get user attendance report
   */
  async getUserAttendanceReport(userId: string, month: number, year: number) {
    const raw = await attendanceDAL.getUserAttendanceStats(userId, month, year);

    const counts = (raw || []).reduce((acc: Record<string, number>, row: any) => {
      if (row?._id) acc[String(row._id)] = Number(row.count) || 0;
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
  async getAttendanceByDateRange(userId: string, startDate: Date, endDate: Date) {
    return await attendanceDAL.findByUserAndDateRange(userId, startDate, endDate);
  }

  /**
   * Get today's attendance for a specific employee
   */
  async getEmployeeTodayAttendance(userId: string) {
    const today = new Date();
    const attendance = await attendanceDAL.findByUserAndDate(userId, today);
    if (!attendance) {
      return null;
    }
    return attendance;
  }
}

export const attendanceService = new AttendanceService();