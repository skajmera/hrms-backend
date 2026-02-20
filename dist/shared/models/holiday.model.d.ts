import mongoose from 'mongoose';
import { IHoliday } from '../interfaces/holiday.interface';
export declare const HolidayModel: mongoose.Model<IHoliday, {}, {}, {}, mongoose.Document<unknown, {}, IHoliday, {}, {}> & IHoliday & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=holiday.model.d.ts.map