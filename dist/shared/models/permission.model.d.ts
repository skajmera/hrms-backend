import mongoose from 'mongoose';
import { IUserPermission } from '../interfaces/permission.interface';
export declare const UserPermissionModel: mongoose.Model<IUserPermission, {}, {}, {}, mongoose.Document<unknown, {}, IUserPermission, {}, {}> & IUserPermission & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=permission.model.d.ts.map