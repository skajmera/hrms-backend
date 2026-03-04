import mongoose from 'mongoose';
import { IOrganization } from '../interfaces/organization.interface';
export declare const OrganizationModel: mongoose.Model<IOrganization, {}, {}, {}, mongoose.Document<unknown, {}, IOrganization, {}, {}> & IOrganization & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=organization.model.d.ts.map