import mongoose from 'mongoose';
import { IPayroll } from '../interfaces/payroll.interface';
export declare const PayrollModel: mongoose.Model<IPayroll, {}, {}, {}, mongoose.Document<unknown, {}, IPayroll, {}, {}> & IPayroll & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=payroll.model.d.ts.map