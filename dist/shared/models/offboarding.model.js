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
exports.OffboardingModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OffboardingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    biometricId: { type: String },
    employeeName: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    // Resignation Details
    resignationDate: {
        type: Date,
        required: true
    },
    lastWorkingDate: {
        type: Date,
        required: true
    },
    noticePeriodDays: {
        type: Number,
        default: 0
    },
    // Reason
    reason: {
        type: String,
        enum: ['BETTER_OPPORTUNITY', 'PERSONAL_REASONS', 'HEALTH_ISSUES', 'RELOCATION', 'HIGHER_STUDIES', 'RETIREMENT', 'OTHER'],
        required: true
    },
    reasonExplanation: { type: String },
    // Status
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'NOTICE_PERIOD', 'COMPLETED', 'WITHDRAWN'],
        default: 'PENDING'
    },
    // Notes
    employeeNotes: { type: String },
    hrNotes: { type: String },
    managerNotes: { type: String },
    // Exit Interview
    exitInterviewScheduled: {
        type: Boolean,
        default: false
    },
    exitInterviewDate: { type: Date },
    exitInterviewNotes: { type: String },
    // Clearance
    clearance: {
        assetReturn: {
            status: {
                type: String,
                enum: ['PENDING', 'COMPLETED'],
                default: 'PENDING'
            },
            completedAt: { type: Date },
            notes: { type: String }
        },
        itClearance: {
            status: {
                type: String,
                enum: ['PENDING', 'COMPLETED'],
                default: 'PENDING'
            },
            completedAt: { type: Date },
            notes: { type: String }
        },
        financeClearance: {
            status: {
                type: String,
                enum: ['PENDING', 'COMPLETED'],
                default: 'PENDING'
            },
            completedAt: { type: Date },
            notes: { type: String }
        },
        hrClearance: {
            status: {
                type: String,
                enum: ['PENDING', 'COMPLETED'],
                default: 'PENDING'
            },
            completedAt: { type: Date },
            notes: { type: String }
        }
    },
    // Final Settlement
    finalSettlement: {
        isPending: {
            type: Boolean,
            default: true
        },
        amount: { type: Number },
        paidOn: { type: Date }
    },
    // Approval
    approvedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    // Metadata
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
// Indexes
OffboardingSchema.index({ userId: 1 });
OffboardingSchema.index({ status: 1 });
OffboardingSchema.index({ resignationDate: 1 });
OffboardingSchema.index({ lastWorkingDate: 1 });
// Calculate notice period before save
OffboardingSchema.pre('save', function (next) {
    if (this.resignationDate && this.lastWorkingDate) {
        const diffTime = Math.abs(this.lastWorkingDate.getTime() - this.resignationDate.getTime());
        this.noticePeriodDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    next();
});
exports.OffboardingModel = mongoose_1.default.model('Offboarding', OffboardingSchema);
//# sourceMappingURL=offboarding.model.js.map