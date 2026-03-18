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
    
    const uploadDir = path.join(process.cwd(), 'uploads', 'payslips');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `payslip_${user.professionalDetails.employeeId}_${payroll.month}_${payroll.year}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    const html = this.buildPayslipHtml({ payroll, user });

    // Lazy import to keep startup light
    const puppeteer = await import('puppeteer');
    const args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--no-zygote', '--single-process', '--disable-gpu'];
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (puppeteer as any).executablePath?.();
    try {
      const browser = await puppeteer.launch({ args, executablePath, headless: 'new' as any });
      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'load' });
        await page.pdf({
          path: filePath,
          format: 'A4',
          printBackground: true,
          margin: { top: '16mm', right: '12mm', bottom: '16mm', left: '12mm' }
        });
        return `/uploads/payslips/${fileName}`;
      } finally {
        await browser.close();
      }
    } catch (e: any) {
      console.error('[PayslipPDF] Failed to generate PDF:', e?.message || e);
      throw new Error('Payslip PDF generation failed on server. If running on Render, ensure Chromium can launch (install deps or set PUPPETEER_EXECUTABLE_PATH).');
    }
  }

  private static money(n: any) {
    const v = Number(n ?? 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(isFinite(v) ? v : 0);
  }

  private static escapeHtml(s: any) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
  }

  private static wordsForINR(amount: number) {
    const a = Math.floor(Math.max(0, Number(amount) || 0));
    if (!a) return 'Zero rupees only';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const two = (n: number) => (n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ''}`.trim());
    const three = (n: number) => (n >= 100 ? `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${two(n % 100)}` : ''}`.trim() : two(n));
    const parts: string[] = [];
    const crore = Math.floor(a / 10000000);
    const lakh = Math.floor((a % 10000000) / 100000);
    const thousand = Math.floor((a % 100000) / 1000);
    const rest = a % 1000;
    if (crore) parts.push(`${three(crore)} Crore`);
    if (lakh) parts.push(`${three(lakh)} Lakh`);
    if (thousand) parts.push(`${three(thousand)} Thousand`);
    if (rest) parts.push(three(rest));
    return `${parts.join(' ')} rupees only`;
  }

  private static buildPayslipHtml({ payroll, user }: PayslipData) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const payPeriod = `${monthNames[(payroll.month || 1) - 1]} ${payroll.year}`;
    const payDate = payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    const paidDays = (payroll.presentDays || 0) + (payroll.paidLeaveDays || 0);
    const lop = (payroll.unpaidLeaveDays || 0) + (payroll.absentDays || 0);

    const earnings = [
      { label: 'Basic', amount: payroll.salaryComponents?.basic ?? 0 },
      { label: 'House Rent Allowance', amount: payroll.salaryComponents?.hra ?? 0 },
      { label: 'Transport Allowance', amount: payroll.salaryComponents?.allowances?.transport ?? 0 },
      { label: 'Medical Allowance', amount: payroll.salaryComponents?.allowances?.medical ?? 0 },
      { label: 'Conveyance', amount: payroll.salaryComponents?.allowances?.transport ?? 0 },
      { label: 'Special Allowance', amount: payroll.salaryComponents?.allowances?.special ?? 0 },
      { label: 'Statutory Bonus', amount: payroll.salaryComponents?.allowances?.statutoryBonus ?? 0 },
      { label: 'Other Allowance', amount: payroll.salaryComponents?.allowances?.other ?? 0 },
      ...(payroll.salaryComponents?.customEarnings || []).map((e: any) => ({ label: e.fieldName, amount: e.fieldValue })),
      { label: 'Bonus', amount: payroll.bonus ?? 0 },
      { label: 'Incentives', amount: payroll.incentives ?? 0 },
      { label: 'Overtime', amount: payroll.overtimeAmount ?? 0 }
    ].filter((x) => Number(x.amount || 0) !== 0);

    const deductions = [
      { label: 'Provident Fund', amount: payroll.salaryComponents?.deductions?.providentFund ?? 0 },
      { label: 'Professional Tax', amount: payroll.salaryComponents?.deductions?.professionalTax ?? 0 },
      { label: 'Income Tax', amount: payroll.salaryComponents?.deductions?.incomeTax ?? 0 },
      { label: 'ESI', amount: payroll.salaryComponents?.deductions?.esi ?? 0 },
      { label: 'Leave Without Pay', amount: payroll.salaryComponents?.deductions?.leaveWithoutPay ?? 0 },
      { label: 'Late Without Pay', amount: payroll.salaryComponents?.deductions?.lateWithoutPay ?? 0 },
      { label: 'Late Arrival Deductions', amount: payroll.salaryComponents?.deductions?.lateArrivalDeductions ?? 0 },
      { label: 'Loan Deduction', amount: payroll.salaryComponents?.deductions?.loanDeduction ?? 0 },
      { label: 'Other', amount: payroll.salaryComponents?.deductions?.other ?? 0 },
      ...(payroll.salaryComponents?.customDeductions || []).map((d: any) => ({ label: d.fieldName, amount: d.fieldValue }))
    ].filter((x) => Number(x.amount || 0) !== 0);

    const earningsRows = (earnings.length ? earnings : [{ label: '—', amount: 0 }])
      .map((e) => `<tr><td>${this.escapeHtml(e.label)}</td><td style="text-align:right;">${this.escapeHtml(this.money(e.amount))}</td></tr>`)
      .join('');
    const deductionsRows = (deductions.length ? deductions : [{ label: '—', amount: 0 }])
      .map((d) => `<tr><td>${this.escapeHtml(d.label)}</td><td style="text-align:right;">${this.escapeHtml(this.money(d.amount))}</td></tr>`)
      .join('');

    const companyName = 'Brain Inventory';
    const companyAddress = 'Shekhar Central, 618 AB Rd, Palasia Square, Indore, Madhya Pradesh, 452001, India';
    const logoUrl = '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Payslip</title>
  <style>
    @page { margin: 0; }
    html, body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #fff; }
    .container { max-width: 800px; margin: auto; background: #fff; border-radius: 10px; border: 1px solid #ddd; overflow: hidden; }
    .header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
    .company { display: flex; gap: 15px; align-items: flex-start; }
    .company img { width: 80px; height: auto; object-fit: contain; }
    .company h2 { margin: 0; }
    .company p { font-size: 11px; color: #666; margin: 5px 0 0; max-width: 260px; line-height: 1.35; }
    .month { text-align: right; }
    .month p { font-size: 11px; color: #888; margin: 0; }
    .month h3 { margin: 5px 0 0; font-size: 14px; }
    .section { padding: 20px; }
    .summary { display: flex; justify-content: space-between; gap: 20px; }
    .employee-details p { margin: 7px 0; font-size: 12.5px; }
    .employee-details span { font-weight: bold; }
    .net-pay { width: 240px; }
    .net-pay .net-box { background: #d4edda; padding: 12px 14px; border-left: 4px solid #2ecc71; border-radius: 5px; }
    .net-pay .net-box h2 { margin: 0; font-size: 18px; line-height: 1.15; }
    .net-pay .net-box p { margin: 5px 0 0; font-size: 12px; color: #333; }
    .net-pay .meta { margin-top: 8px; padding-left: 16px; font-size: 12px; color: #333; }
    .net-pay .meta p { margin: 5px 0 0; }
    .table-section { display: flex; gap: 20px; padding: 0 20px 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; border-bottom: 1px solid #ddd; padding-bottom: 8px; font-size: 12.5px; }
    td { padding: 7px 0; font-size: 12.5px; border-bottom: 1px solid #f2f2f2; }
    tr:last-child td { border-bottom: none; }
    .totals { background: #f4f6fb; font-weight: bold; }
    .totals td { padding: 10px 0; border-bottom: none; }
    .net-total { display: flex; justify-content: space-between; margin: 20px; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
    .net-total .label { padding: 15px; }
    .net-total .amount { background: #d4edda; padding: 15px 22px; font-weight: bold; font-size: 16px; white-space: nowrap; }
    .footer { text-align: right; padding: 10px 20px 20px; font-size: 11.5px; color: #555; }
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="company">
      ${logoUrl ? `<img src="${this.escapeHtml(logoUrl)}" />` : `<div style="width:80px;"></div>`}
      <div>
        <h2>${this.escapeHtml(companyName)}</h2>
        <p>${this.escapeHtml(companyAddress)}</p>
      </div>
    </div>
    <div class="month">
      <p>Payslip for the Month</p>
      <h3>${this.escapeHtml(payPeriod)}</h3>
    </div>
  </div>

  <div class="section summary">
    <div class="employee-details">
      <p>Employee Name: <span>${this.escapeHtml(user.getFullName())}</span></p>
      <p>Employee ID: <span>${this.escapeHtml(user.professionalDetails?.employeeId)}</span></p>
      <p>Pay Period: <span>${this.escapeHtml(payPeriod)}</span></p>
      <p>Pay Date: <span>${this.escapeHtml(payDate)}</span></p>
    </div>
    <div class="net-pay">
      <div class="net-box">
        <h2>${this.escapeHtml(this.money(payroll.netSalary))}</h2>
        <p>Total Net Pay</p>
      </div>
      <div class="meta">
        <p>Paid Days: ${this.escapeHtml(paidDays)}</p>
        <p>LOP: ${this.escapeHtml(lop)}</p>
      </div>
    </div>
  </div>

  <div class="table-section">
    <table>
      <thead>
        <tr><th>Earnings</th><th style="text-align:right;">Amount</th></tr>
      </thead>
      <tbody>
        ${earningsRows}
        <tr class="totals"><td>Gross Earnings</td><td style="text-align:right;">${this.escapeHtml(this.money(payroll.grossSalary))}</td></tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr><th>Deductions</th><th style="text-align:right;">Amount</th></tr>
      </thead>
      <tbody>
        ${deductionsRows}
        <tr class="totals"><td>Gross Deductions</td><td style="text-align:right;">${this.escapeHtml(this.money(payroll.totalDeductions))}</td></tr>
      </tbody>
    </table>
  </div>

  <div class="net-total">
    <div class="label">
      <strong>TOTAL NET PAYABLE</strong><br/>
      <small>Gross Earnings - Gross Deductions</small>
    </div>
    <div class="amount">${this.escapeHtml(this.money(payroll.netSalary))}</div>
  </div>

  <div class="footer">
    Amount in words: <strong>${this.escapeHtml(this.wordsForINR(Number(payroll.netSalary || 0)))}</strong>
  </div>
</div>
</body>
</html>`;
  }

  /**
   * Generate multiple payslips
   */
  static async generateBulkPayslips(payslips: PayslipData[]): Promise<string[]> {
    const promises = payslips.map(data => this.generateSalarySlip(data));
    return await Promise.all(promises);
  }
}