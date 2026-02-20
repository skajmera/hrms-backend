import mongoose from 'mongoose';
import { ILeave, ILeaveBalance } from '../interfaces/leave.interface';
export declare const LeaveModel: mongoose.Model<ILeave, {}, {}, {}, mongoose.Document<unknown, {}, ILeave, {}, {}> & ILeave & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const LeaveBalanceModel: mongoose.Model<ILeaveBalance, {}, {}, {}, mongoose.Document<unknown, {}, ILeaveBalance, {}, {}> & ILeaveBalance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=leave.model.d.ts.map