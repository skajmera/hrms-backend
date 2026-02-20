"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holidayDAL = exports.HolidayDAL = void 0;
const holiday_model_1 = require("../models/holiday.model");
class HolidayDAL {
    async create(holidayData) {
        return await holiday_model_1.HolidayModel.create(holidayData);
    }
    async findById(id) {
        return await holiday_model_1.HolidayModel.findById(id);
    }
    async findAll(filters = {}) {
        return await holiday_model_1.HolidayModel.find(filters).sort({ date: 1 });
    }
    async update(id, updateData) {
        return await holiday_model_1.HolidayModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    async delete(id) {
        return await holiday_model_1.HolidayModel.findByIdAndDelete(id);
    }
    async getHolidaysByYear(year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        return await holiday_model_1.HolidayModel.find({
            date: { $gte: startDate, $lte: endDate },
            isActive: true
        }).sort({ date: 1 });
    }
}
exports.HolidayDAL = HolidayDAL;
exports.holidayDAL = new HolidayDAL();
//# sourceMappingURL=holiday.dal.js.map