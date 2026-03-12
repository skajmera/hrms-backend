"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementUpload = exports.cleanupFile = exports.avatarUpload = exports.attendanceUpload = exports.payrollUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Create uploads directory if it doesn't exist
const uploadDir = './uploads/payroll';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `payroll-${uniqueSuffix}${ext}`);
    }
});
// File filter - only allow Excel and CSV files
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv' // .csv
    ];
    const allowedExtensions = ['.xls', '.xlsx', '.csv'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only .xls, .xlsx and .csv formats are supported'));
    }
};
// Configure multer for payroll
exports.payrollUpload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
// --- Attendance Selfie Upload ---
const attendanceDir = './uploads/attendance';
if (!fs_1.default.existsSync(attendanceDir)) {
    fs_1.default.mkdirSync(attendanceDir, { recursive: true });
}
const attendanceStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, attendanceDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `selfie-${uniqueSuffix}${ext}`);
    }
});
const imageFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only .jpg, .jpeg and .png formats are supported'));
    }
};
exports.attendanceUpload = (0, multer_1.default)({
    storage: attendanceStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
});
// --- Avatar Upload ---
const avatarDir = './uploads/avatars';
if (!fs_1.default.existsSync(avatarDir)) {
    fs_1.default.mkdirSync(avatarDir, { recursive: true });
}
const avatarStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    }
});
exports.avatarUpload = (0, multer_1.default)({
    storage: avatarStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
});
// Cleanup uploaded file helper
const cleanupFile = (filePath) => {
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
};
exports.cleanupFile = cleanupFile;
// --- Announcement Upload ---
const announcementDir = './uploads/announcements';
if (!fs_1.default.existsSync(announcementDir)) {
    fs_1.default.mkdirSync(announcementDir, { recursive: true });
}
const announcementStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, announcementDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `announcement-${uniqueSuffix}${ext}`);
    }
});
const announcementFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only .jpg, .jpeg, .png, .pdf, .doc, and .docx formats are supported for announcements'));
    }
};
exports.announcementUpload = (0, multer_1.default)({
    storage: announcementStorage,
    fileFilter: announcementFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for announcements to support PDFs
    }
});
//# sourceMappingURL=upload.middleware.js.map