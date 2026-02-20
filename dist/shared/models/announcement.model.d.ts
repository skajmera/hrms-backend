import mongoose from 'mongoose';
import { IAnnouncement } from '../interfaces/announcement.interface';
export declare const AnnouncementModel: mongoose.Model<IAnnouncement, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncement, {}, {}> & IAnnouncement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=announcement.model.d.ts.map