"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DepartmentSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    // Hierarchy
    parentDepartment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department' },
    level: { type: Number, default: 0 },
    path: { type: String }, // e.g., "/Engineering/Backend"
    // Leadership
    headOfDepartment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    // Members
    employees: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    employeeCount: { type: Number, default: 0 },
    // Contact
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    location: { type: String },
    // Budget
    budget: {
        allocated: { type: Number, default: 0 },
        spent: { type: Number, default: 0 },
        fiscalYear: { type: Number }
    },
    // Status
    isActive: { type: Boolean, default: true },
    // Metadata
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});
// Indexes
DepartmentSchema.index({ code: 1 });
DepartmentSchema.index({ parentDepartment: 1 });
DepartmentSchema.index({ level: 1 });
// Update employee count before save
DepartmentSchema.pre('save', function (next) {
    this.employeeCount = this.employees.length;
    next();
});
// Build path before save
DepartmentSchema.pre('save', async function (next) {
    if (this.parentDepartment) {
        const parent = await mongoose_1.default.model('Department').findById(this.parentDepartment);
        if (parent) {
            this.path = `${parent.path}/${this.name}`;
            this.level = parent.level + 1;
        }
    }
    else {
        this.path = `/${this.name}`;
        this.level = 0;
    }
    next();
});
exports.DepartmentModel = mongoose_1.default.model('Department', DepartmentSchema);
//# sourceMappingURL=department.model.js.map