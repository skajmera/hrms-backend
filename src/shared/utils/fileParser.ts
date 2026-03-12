import * as XLSX from 'xlsx';
import fs from 'fs';
import csvParser from 'csv-parser';

export interface ParsedPayrollData {
  employeeName?: string;
  employeeId?: string;
  month?: number;
  year?: number;
  basic?: number;
  hra?: number;
  conveyance?: number;
  specialAllowance?: number;
  statutoryBonus?: number;
  otherAllowances?: number;
  byodPayment?: number;
  taskBasedIncentive?: number;
  arrearMonth?: string;
  arrearAmount?: number;
  specialPay?: number;
  miscellaneousPay?: number;
  nonWorkingDayCompensation?: number;
  providentFund?: number;
  esic?: number;
  professionalTax?: number;
  leaveWithoutPay?: number;
  lateWithoutPay?: number;
  lateArrivalDeductions?: number;
  tds?: number;
  loanRepayment?: number;
  workingDays?: number;
  presentDays?: number;
  lopDays?: number;
  [key: string]: any;
}

export class FileParser {
  /**
   * Parse Excel file (XLS or XLSX)
   */
  static async parseExcel(filePath: string): Promise<ParsedPayrollData[]> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: null
      });

      // Map to our structure
      return this.mapDataToPayroll(jsonData);
    } catch (error) {
      throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse CSV file
   */
  static async parseCSV(filePath: string): Promise<ParsedPayrollData[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          try {
            const mappedData = this.mapDataToPayroll(results);
            resolve(mappedData);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => reject(error));
    });
  }

  /**
   * Map parsed data to payroll structure
   */
  private static mapDataToPayroll(data: any[]): ParsedPayrollData[] {
    return data
      .filter((row) => {
        // Skip rows that are completely empty
        return Object.values(row).some(val => val !== null && val !== undefined && val !== '');
      })
      .map((row) => {
        // Normalize keys (remove spaces, convert to camelCase)
        const normalizedRow: any = {};
        Object.keys(row).forEach(key => {
          const normalizedKey = this.normalizeKey(key);
          normalizedRow[normalizedKey] = row[key];
        });

        return {
          employeeName: normalizedRow.employeeName || normalizedRow.name || null,
          employeeId: normalizedRow.employeeId || normalizedRow.empId || normalizedRow.employeeCode || null,
          month: this.parseNumber(normalizedRow.month || normalizedRow.paymentMonth),
          year: this.parseNumber(normalizedRow.year || normalizedRow.paymentYear),

          // Earnings
          basic: this.parseNumber(normalizedRow.basic || normalizedRow.basicSalary),
          hra: this.parseNumber(normalizedRow.hra || normalizedRow.houseRentAllowance),
          conveyance: this.parseNumber(normalizedRow.conveyance || normalizedRow.transport),
          specialAllowance: this.parseNumber(normalizedRow.specialAllowance),
          statutoryBonus: this.parseNumber(normalizedRow.statutoryBonus),
          otherAllowances: this.parseNumber(normalizedRow.otherAllowances || normalizedRow.otherAllowance),
          byodPayment: this.parseNumber(normalizedRow.byodPayment),
          taskBasedIncentive: this.parseNumber(normalizedRow.taskBasedIncentive),
          arrearMonth: normalizedRow.arrearMonth || null,
          arrearAmount: this.parseNumber(normalizedRow.arrearAmount || normalizedRow.arrear),
          specialPay: this.parseNumber(normalizedRow.specialPay || normalizedRow.specialPayAdjustable),
          miscellaneousPay: this.parseNumber(normalizedRow.miscellaneousPay || normalizedRow.miscellaneous),
          nonWorkingDayCompensation: this.parseNumber(normalizedRow.nonWorkingDayCompensation),

          // Deductions
          providentFund: this.parseNumber(normalizedRow.providentFund || normalizedRow.pf),
          esic: this.parseNumber(normalizedRow.esic || normalizedRow.esi),
          professionalTax: this.parseNumber(normalizedRow.professionalTax || normalizedRow.pt),
          leaveWithoutPay: this.parseNumber(normalizedRow.leaveWithoutPay || normalizedRow.lwp),
          lateWithoutPay: this.parseNumber(normalizedRow.lateWithoutPay),
          lateArrivalDeductions: this.parseNumber(normalizedRow.lateArrivalDeductions || normalizedRow.lateArrivalDeduction),
          tds: this.parseNumber(normalizedRow.tds || normalizedRow.incomeTax),
          loanRepayment: this.parseNumber(normalizedRow.loanRepayment || normalizedRow.loadRepayment),

          // Attendance
          workingDays: this.parseNumber(normalizedRow.workingDays),
          presentDays: this.parseNumber(normalizedRow.presentDays || normalizedRow.paidDays),
          lopDays: this.parseNumber(normalizedRow.lopDays || normalizedRow.lop)
        };
      });
  }

  /**
   * Normalize key to camelCase
   */
  private static normalizeKey(key: string): string {
    return key
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace non-alphanumeric (except spaces) with space
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }

  /**
   * Parse string to number
   */
  private static parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    // Remove currency symbols and commas
    const cleanValue = String(value).replace(/[₹$,\s]/g, '');
    const parsed = parseFloat(cleanValue);

    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Validate parsed data
   */
  static validatePayrollData(data: ParsedPayrollData[]): { valid: ParsedPayrollData[], invalid: any[] } {
    const valid: ParsedPayrollData[] = [];
    const invalid: any[] = [];

    data.forEach((row, index) => {
      const errors: string[] = [];

      // Required fields validation
      if (!row.employeeName && !row.employeeId) {
        errors.push('Employee Name or Employee ID is required');
      }

      if (!row.month || row.month < 1 || row.month > 12) {
        errors.push('Valid month (1-12) is required');
      }

      if (!row.year || row.year < 2000) {
        errors.push('Valid year is required');
      }

      if (!row.basic || row.basic <= 0) {
        errors.push('Valid basic salary is required');
      }

      if (errors.length > 0) {
        invalid.push({
          row: index + 1,
          data: row,
          errors
        });
      } else {
        valid.push(row);
      }
    });

    return { valid, invalid };
  }

  /**
   * Generate sample template
   */
  static generateSampleTemplate(): any {
    const sampleData = [
      {
        'Employee Name': 'John Doe',
        'Employee ID': 'EMP001',
        'Month': 1,
        'Year': 2026,
        'Basic Salary': 50000,
        'House Rent Allowance': 20000,
        'Conveyance': 2000,
        'Special Allowance': 3000,
        'Statutory Bonus': 2000,
        'Other Allowance': 1000,
        'BYOD Payment': 500,
        'Task Based Incentive': 5000,
        'Arrear Month': 'December',
        'Arrear Amount': 0,
        'Special Pay Adjustable': 0,
        'Miscellaneous': 0,
        'Non Working Day Compensation': 0,
        'Provident Fund': 6000,
        'ESIC': 750,
        'Professional Tax': 200,
        'Leave Without Pay': 0,
        'Late Arrival Deduction': 0,
        'TDS': 5000,
        'Load Repayment': 2000,
        'Working Days': 30,
        'Present Days': 28,
        'LOP Days': 0
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll Template');

    return workbook;
  }
}