import mongoose from 'mongoose';
import { IAttendance } from '../interfaces/attendance.interface';
export declare const AttendanceModel: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance, {}, {}> & IAttendance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=attendance.model.d.ts.map