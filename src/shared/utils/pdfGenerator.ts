import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IPayroll } from '../interfaces/payroll.interface';
import { IUser } from '../interfaces/user.interface';

interface PayslipData {
  payroll: IPayroll;
  user: IUser;
}

export class PDFGenerator {
  /**
   * Generate salary slip PDF
   */
  static async generateSalarySlip(data: PayslipData): Promise<string> {
    const { payroll, user } = data;
    
    return new Promise((resolve, reject) => {
      try {
        // Create uploads directory if not exists
        const uploadDir = path.join(process.cwd(), 'uploads', 'payslips');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate filename
        const fileName = `payslip_${user.professionalDetails.employeeId}_${payroll.month}_${payroll.year}.pdf`;
        const filePath = path.join(uploadDir, fileName);

        // Create PDF document
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Pipe to file
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Add content
        this.addHeader(doc, user, payroll);
        this.addEmployeeDetails(doc, user,payroll);
        this.addSalaryDetails(doc, payroll);
        this.addFooter(doc);

        // Finalize PDF
        doc.end();

        stream.on('finish', () => {
          resolve(`/uploads/payslips/${fileName}`);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Add header to PDF
   */
  private static addHeader(doc: PDFKit.PDFDocument, user: IUser, payroll: IPayroll) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Company logo/name
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('BRAIN INVENTORY', 50, 50, { align: 'center' })
      .fontSize(10)
      .font('Helvetica')
      .text('Human Resource Management System', { align: 'center' })
      .moveDown();

    // Payslip title
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('SALARY SLIP', { align: 'center' })
      .fontSize(12)
      .font('Helvetica')
      .text(`${monthNames[payroll.month - 1]} ${payroll.year}`, { align: 'center' })
      .moveDown(2);

    // Draw line
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown();
  }

  /**
   * Add employee details
   */
  private static addEmployeeDetails(doc: PDFKit.PDFDocument, user: IUser,payroll: IPayroll) {
    const startY = doc.y;
    
    // Left column
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Employee Name:', 50, startY)
      .font('Helvetica')
      .text(user.getFullName(), 150, startY)
      
      .font('Helvetica-Bold')
      .text('Employee ID:', 50, startY + 20)
      .font('Helvetica')
      .text(user.professionalDetails.employeeId, 150, startY + 20)
      
      .font('Helvetica-Bold')
      .text('Designation:', 50, startY + 40)
      .font('Helvetica')
      .text(user.professionalDetails.designation, 150, startY + 40);

    // Right column
    doc
      .font('Helvetica-Bold')
      .text('Department:', 320, startY)
      .font('Helvetica')
      .text(user.professionalDetails.department?.name || 'N/A', 420, startY)
      
      .font('Helvetica-Bold')
      .text('Date of Joining:', 320, startY + 20)
      .font('Helvetica')
      .text(new Date(user.professionalDetails.joiningDate).toLocaleDateString(), 420, startY + 20)
      
      .font('Helvetica-Bold')
      .text('Pay Date:', 320, startY + 40)
      .font('Helvetica')
      .text(payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString() : 'Pending', 420, startY + 40);

    doc.moveDown(4);

    // Draw line
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown();
  }

  /**
   * Add salary details table
   */
  private static addSalaryDetails(doc: PDFKit.PDFDocument, payroll: IPayroll) {
    const tableTop = doc.y;
    const col1X = 50;
    const col2X = 300;
    const col3X = 400;
    const col4X = 500;

    // Table header
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#333333')
      .rect(50, tableTop, 495, 25)
      .fill('#E8F4FD')
      .fillColor('#000000')
      .text('Earnings', col1X + 10, tableTop + 8)
      .text('Amount (₹)', col2X + 10, tableTop + 8)
      .text('Deductions', col3X + 10, tableTop + 8)
      .text('Amount (₹)', col4X + 10, tableTop + 8);

    doc.moveDown();

    let currentY = tableTop + 35;

    // Earnings
    const earnings = [
      { label: 'Basic Salary', value: payroll.salaryComponents.basic },
      { label: 'HRA', value: payroll.salaryComponents.hra },
      { label: 'Transport Allowance', value: payroll.salaryComponents.allowances.transport },
      { label: 'Medical Allowance', value: payroll.salaryComponents.allowances.medical },
      { label: 'Special Allowance', value: payroll.salaryComponents.allowances.special },
      { label: 'Food Allowance', value: payroll.salaryComponents.allowances.foodAllowance },
      { label: 'Other Allowances', value: payroll.salaryComponents.allowances.other },
      { label: 'Bonus', value: payroll.bonus || 0 },
      { label: 'Incentives', value: payroll.incentives || 0 },
      { label: 'Overtime', value: payroll.overtimeAmount || 0 },
    ];

    // Deductions
    const deductions = [
      { label: 'Provident Fund', value: payroll.salaryComponents.deductions.providentFund },
      { label: 'Professional Tax', value: payroll.salaryComponents.deductions.professionalTax },
      { label: 'Income Tax', value: payroll.salaryComponents.deductions.incomeTax },
      { label: 'ESI', value: payroll.salaryComponents.deductions.esi || 0 },
      { label: 'Loan Deduction', value: payroll.salaryComponents.deductions.loanDeduction || 0 },
      { label: 'Other Deductions', value: payroll.salaryComponents.deductions.other },
    ];

    doc.font('Helvetica');

    const maxRows = Math.max(earnings.length, deductions.length);

    for (let i = 0; i < maxRows; i++) {
      // Earnings
      if (i < earnings.length) {
        doc
          .text(earnings[i].label, col1X + 10, currentY)
          .text(
            (earnings[i]?.value ?? 0).toFixed(2),
            col2X + 10,
            currentY,
            { align: 'right', width: 80 }
          );
      }

      // Deductions
      if (i < deductions.length) {
        doc
          .text(deductions[i].label, col3X + 10, currentY)
          .text(
            (deductions[i]?.value ?? 0).toFixed(2),
            col4X + 10,
            currentY,
            { align: 'right', width: 80 }
          );
          
      }

      currentY += 20;
    }

    // Draw line
    doc
      .moveTo(50, currentY)
      .lineTo(545, currentY)
      .stroke();

    currentY += 10;

    // Totals
    doc
      .font('Helvetica-Bold')
      .text('Gross Salary', col1X + 10, currentY)
      .text(payroll.grossSalary.toFixed(2), col2X + 10, currentY, { align: 'right', width: 80 })
      .text('Total Deductions', col3X + 10, currentY)
      .text(payroll.totalDeductions.toFixed(2), col4X + 10, currentY, { align: 'right', width: 80 });

    currentY += 25;

    // Draw thick line
    doc
      .moveTo(50, currentY)
      .lineTo(545, currentY)
      .lineWidth(2)
      .stroke()
      .lineWidth(1);

    currentY += 15;

    // Net Salary
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#1E40AF')
      .text('NET SALARY', col1X + 10, currentY)
      .text(`₹ ${payroll.netSalary.toFixed(2)}`, col4X + 10, currentY, { align: 'right', width: 80 })
      .fillColor('#000000');

    currentY += 30;

    // Attendance details
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Attendance Summary:', 50, currentY);

    currentY += 20;

    doc
      .font('Helvetica')
      .text(`Working Days: ${payroll.workingDays}`, 70, currentY)
      .text(`Present Days: ${payroll.presentDays}`, 200, currentY)
      .text(`Absent Days: ${payroll.absentDays}`, 330, currentY)
      .text(`Leave Days: ${payroll.paidLeaveDays + payroll.unpaidLeaveDays}`, 460, currentY);

    doc.moveDown(3);
  }

  /**
   * Add footer
   */
  private static addFooter(doc: PDFKit.PDFDocument) {
    const pageHeight = 842; // A4 height in points
    const footerY = pageHeight - 100;

    doc
      .fontSize(9)
      .font('Helvetica-Oblique')
      .fillColor('#666666')
      .text(
        'This is a computer-generated document and does not require a signature.',
        50,
        footerY,
        { align: 'center', width: 495 }
      )
      .moveDown()
      .text(
        '© Brain Inventory - HRMS',
        { align: 'center' }
      )
      .fillColor('#000000');

    // Add page number
    doc
      .fontSize(8)
      .text(
        `Page 1 of 1`,
        50,
        footerY + 40,
        { align: 'center', width: 495 }
      );
  }

  /**
   * Generate multiple payslips
   */
  static async generateBulkPayslips(payslips: PayslipData[]): Promise<string[]> {
    const promises = payslips.map(data => this.generateSalarySlip(data));
    return await Promise.all(promises);
  }
}