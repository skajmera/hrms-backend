"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLeaveApprovalEmail = exports.sendPasswordResetEmail = exports.sendWelcomeEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../../config/env");
/**
 * Create email transporter
 */
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: env_1.config.email.host,
        port: env_1.config.email.port,
        secure: false,
        auth: {
            user: env_1.config.email.user,
            pass: env_1.config.email.pass
        }
    });
};
/**
 * Send email
 */
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: env_1.config.email.from,
            to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
            attachments: options.attachments
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${mailOptions.to}`);
    }
    catch (error) {
        console.error('❌ Email sending failed:', error);
        throw new Error('Failed to send email');
    }
};
exports.sendEmail = sendEmail;
/**
 * Send welcome email
 */
const sendWelcomeEmail = async (name, loginId, password) => {
    const message = `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 6px;">

      <h2 style="color: #2c3e50; margin-bottom: 10px;">
        Welcome to Brain Inventory HRMS
      </h2>

      <p style="font-size: 14px; color: #333;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="font-size: 14px; color: #333;">
        Your Organization account has been created successfully. Below are your login credentials:
      </p>

      <div style="background-color: #f9fafb; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <p style="margin: 6px 0;"><strong>Login URL:</strong> 
          <a href="https://localhost:5173/login" target="_blank">
            https://localhost:5173/login
          </a>
        </p>
        <p style="margin: 6px 0;"><strong>Login ID:</strong> ${loginId}</p>
        <p style="margin: 6px 0;"><strong>Temporary Password:</strong> ${password}</p>
      </div>

      <p style="font-size: 14px; color: #d35400;">
        ⚠️ For security reasons, please change your password immediately after your first login.
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="https://localhost:5173/login"
           style="background-color: #2c7be5; color: #ffffff; padding: 10px 20px; 
                  text-decoration: none; border-radius: 4px; font-size: 14px;">
          Login to HRMS
        </a>
      </div>

      <p style="font-size: 13px; color: #555;">
        If you face any issues while logging in, please contact the HR or IT support team.
      </p>

      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />

      <p style="font-size: 12px; color: #888;">
        Regards,<br/>
        <strong>HR Team</strong><br/>
        Brain Inventory
      </p>

    </div>
  </div>
  `;
    await (0, exports.sendEmail)({
        to: loginId,
        subject: 'Welcome to Brain Inventory',
        html: message
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
// export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
//   await sendEmail({
//     to: email,
//     subject: 'Welcome to Brain Inventory HRMS',
//     html: `
//       <h1>Welcome ${name}!</h1>
//       <p>Your account has been created successfully.</p>
//       <p>Please login to access the HRMS portal.</p>
//     `
//   });
// };
/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${env_1.config.cors.origin}/reset-password?token=${resetToken}`;
    await (0, exports.sendEmail)({
        to: email,
        subject: 'Password Reset Request',
        html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `
    });
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
/**
 * Send leave approval notification
 */
const sendLeaveApprovalEmail = async (email, name, leaveType, startDate, endDate) => {
    await (0, exports.sendEmail)({
        to: email,
        subject: 'Leave Request Approved',
        html: `
      <h1>Leave Approved</h1>
      <p>Hello ${name},</p>
      <p>Your ${leaveType} leave request has been approved.</p>
      <p><strong>From:</strong> ${startDate}</p>
      <p><strong>To:</strong> ${endDate}</p>
    `
    });
};
exports.sendLeaveApprovalEmail = sendLeaveApprovalEmail;
//# sourceMappingURL=email.js.map