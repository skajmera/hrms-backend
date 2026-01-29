export const emailTemplates = {
    leaveApproved: (name: string, leaveType: string, startDate: string, endDate: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Leave Approved ✅</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Your <strong>${leaveType}</strong> leave request has been approved!</p>
            <p><strong>Leave Details:</strong></p>
            <ul>
              <li>From: ${startDate}</li>
              <li>To: ${endDate}</li>
            </ul>
            <p>Enjoy your time off!</p>
          </div>
          <div class="footer">
            <p>Brain Inventory HRMS</p>
          </div>
        </div>
      </body>
      </html>
    `,
  
    payslipGenerated: (name: string, month: string, year: string, netSalary: number) => `
      <!DOCTYPE html>
      <html>
      <body>
        <h2>Payslip Generated</h2>
        <p>Dear ${name},</p>
        <p>Your payslip for <strong>${month} ${year}</strong> has been generated.</p>
        <p><strong>Net Salary:</strong> ₹${netSalary.toLocaleString()}</p>
        <p>Please login to download your payslip.</p>
        <p>Best regards,<br>Brain Inventory HR</p>
      </body>
      </html>
    `,
  
    birthday: (name: string) => `
      <!DOCTYPE html>
      <html>
      <body style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
        <div style="background: white; padding: 40px; border-radius: 20px; max-width: 500px; margin: 0 auto;">
          <h1 style="color: #667eea;">🎉 Happy Birthday ${name}! 🎂</h1>
          <p style="font-size: 18px; color: #333;">Wishing you a fantastic day filled with joy and happiness!</p>
          <p>From all of us at Brain Inventory</p>
        </div>
      </body>
      </html>
    `
  };