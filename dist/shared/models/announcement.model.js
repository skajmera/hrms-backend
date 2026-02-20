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
exports.AnnouncementModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../../config/constants");
const AnnouncementSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    priority: {
        type: String,
        enum: Object.values(constants_1.ANNOUNCEMENT_PRIORITY),
        default: constants_1.ANNOUNCEMENT_PRIORITY.MEDIUM
    },
    // Dates
    startDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date },
    announcementType: {
        type: String,
        enum: ["GENERAL", "BIRTHDAY", "ANNIVERSARY", "EVENT", "EMERGENCY", "OTHER", "NEWHIRE"],
        required: true
    },
    // Target Audience
    targetAudience: {
        departments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Department' }],
        roles: [{ type: String }],
        specificUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        isGlobal: { type: Boolean, default: false }
    },
    // Attachments
    attachments: [{
            name: { type: String },
            url: { type: String },
            type: { type: String },
            size: { type: Number }
        }],
    // Status
    isPinned: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    // Creator
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Tracking
    viewedBy: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            viewedAt: { type: Date, default: Date.now }
        }]
}, {
    timestamps: true
});
// Indexes
AnnouncementSchema.index({ startDate: 1, expiryDate: 1 });
AnnouncementSchema.index({ priority: 1 });
AnnouncementSchema.index({ 'targetAudience.isGlobal': 1 });
AnnouncementSchema.index({ isPinned: 1 });
exports.AnnouncementModel = mongoose_1.default.model('Announcement', AnnouncementSchema);
//# sourceMappingURL=announcement.model.js.map