import { IHoliday } from '../interfaces/holiday.interface';
export declare class HolidayDAL {
    create(holidayData: any): Promise<IHoliday>;
    findById(id: string): Promise<IHoliday | null>;
    findAll(filters?: any): Promise<IHoliday[]>;
    update(id: string, updateData: any): Promise<IHoliday | null>;
    delete(id: string): Promise<IHoliday | null>;
    getHolidaysByYear(year: number): Promise<IHoliday[]>;
}
export declare const holidayDAL: HolidayDAL;
//# sourceMappingURL=holiday.dal.d.ts.map