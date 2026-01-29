import { Document,Types } from 'mongoose';

export interface IHoliday extends Document {
  name: string;
  date: Date;
  type: 'PUBLIC' | 'RESTRICTED' | 'OPTIONAL';
  description?: string;
  isActive: boolean;
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}