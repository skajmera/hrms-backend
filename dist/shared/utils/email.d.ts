export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: any[];
}
/**
 * Send email
 */
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
/**
 * Send welcome email
 */
export declare const sendWelcomeEmail: (name: string, loginId: string, password: string) => Promise<void>;
/**
 * Send password reset email
 */
export declare const sendPasswordResetEmail: (email: string, resetToken: string) => Promise<void>;
/**
 * Send leave approval notification
 */
export declare const sendLeaveApprovalEmail: (email: string, name: string, leaveType: string, startDate: string, endDate: string) => Promise<void>;
//# sourceMappingURL=email.d.ts.map