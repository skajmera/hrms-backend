import { HolidayModel } from '../models/holiday.model';
import { IHoliday } from '../interfaces/holiday.interface';

export class HolidayDAL {
  async create(holidayData: any): Promise<IHoliday> {
    return await HolidayModel.create(holidayData);
  }

  async findById(id: string): Promise<IHoliday | null> {
    return await HolidayModel.findById(id);
  }

  async findAll(filters: any = {}): Promise<IHoliday[]> {
    return await HolidayModel.find(filters).sort({ date: 1 });
  }

  async update(id: string, updateData: any): Promise<IHoliday | null> {
    return await HolidayModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<IHoliday | null> {
    return await HolidayModel.findByIdAndDelete(id);
  }

  async getHolidaysByYear(year: number): Promise<IHoliday[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    return await HolidayModel.find({
      date: { $gte: startDate, $lte: endDate },
      isActive: true
    }).sort({ date: 1 });
  }
}

export const holidayDAL = new HolidayDAL();