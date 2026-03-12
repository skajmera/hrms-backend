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
exports.NotificationSettingsModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const NotificationSettingsSchema = new mongoose_1.Schema({
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendance: {
        checkInCheckOut: { type: Boolean, default: true },
        lateArrival: { type: Boolean, default: true },
        earlyExit: { type: Boolean, default: true }
    },
    leaves: {
        application: { type: Boolean, default: true },
        newRequest: { type: Boolean, default: true },
        approval: { type: Boolean, default: true },
        rejection: { type: Boolean, default: true }
    },
    announcements: {
        newAnnouncement: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
        likes: { type: Boolean, default: false },
        comments: { type: Boolean, default: true }
    },
    reminders: {
        birthdays: { type: Boolean, default: true },
        anniversaries: { type: Boolean, default: true },
        newHiring: { type: Boolean, default: true }
    },
    payroll: {
        payslipGenerated: { type: Boolean, default: true },
        paymentProcessed: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});
// Unique index
NotificationSettingsSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
exports.NotificationSettingsModel = mongoose_1.default.model('NotificationSettings', NotificationSettingsSchema);
//# sourceMappingURL=notification-settings.model.js.map