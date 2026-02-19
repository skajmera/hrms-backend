import path from 'path';
import { FileParser, ParsedPayrollData } from '../../../../shared/utils/fileParser';
import { userDAL } from '../../../../shared/dal/user.dal';
import { payrollDAL } from '../../../../shared/dal/payroll.dal';
import { IPayroll } from '../../../../shared/interfaces/payroll.interface';
import { cleanupFile } from '../../../../shared/middlewares/upload.middleware';

export class PayrollImportService {
  /**
   * Process uploaded payroll file
   */
  static async processPayrollFile(
    filePath: string,
    importBasedOn: 'employeeName' | 'employeeId',
    generatedBy: string
  ): Promise<{
    success: number;
    failed: number;
    errors: any[];
    successfulPayrolls: IPayroll[];
  }> {
    try {
      const ext = path.extname(filePath).toLowerCase();
      let parsedData: ParsedPayrollData[];

      // Parse file based on extension
      if (ext === '.csv') {
        parsedData = await FileParser.parseCSV(filePath);
      } else if (ext === '.xls' || ext === '.xlsx') {
        parsedData = await FileParser.parseExcel(filePath);
      } else {
        throw new Error('Unsupported file format');
      }

      // Validate data
      const { valid, invalid } = FileParser.validatePayrollData(parsedData);

      // Process valid records
      const results = await this.createPayrollsFromData(valid, importBasedOn, generatedBy);

      // Cleanup file
      cleanupFile(filePath);

      return {
        success: results.successful.length,
        failed: results.failed.length + invalid.length,
        errors: [...results.failed, ...invalid],
        successfulPayrolls: results.successful
      };
    } catch (error) {
      // Cleanup file on error
      cleanupFile(filePath);
      throw error;
    }
  }

  /**
   * Create payroll records from parsed data
   */
  private static async createPayrollsFromData(
    data: ParsedPayrollData[],
    importBasedOn: 'employeeName' | 'employeeId',
    generatedBy: string
  ): Promise<{
    successful: IPayroll[];
    failed: any[];
  }> {
    const successful: IPayroll[] = [];
    const failed: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Find user
        let user;
        if (importBasedOn === 'employeeId' && row.employeeId) {
          user = await userDAL.findByEmployeeId(row.employeeId);
        } else if (importBasedOn === 'employeeName' && row.employeeName) {
          // Search by name (approximate match)
          const searchResult = await userDAL.search(row.employeeName);//userDAL.search(row.employeeName, { page: 1, limit: 1 });
        //   user = searchResult.data[0];
        user = searchResult[0];
        }

        if (!user) {
          failed.push({
            row: i + 1,
            data: row,
            error: `User not found: ${row.employeeName || row.employeeId}`
          });
          continue;
        }

        // Check if payroll already exists
        const existingPayroll = await payrollDAL.findByUserAndPeriod(
          user._id.toString(),
          row.month!,
          row.year!
        );

        if (existingPayroll) {
          failed.push({
            row: i + 1,
            data: row,
            error: `Payroll already exists for ${user.firstName} ${user.lastName} for ${row.month}/${row.year}`
          });
          continue;
        }

        // Create payroll data
        const payrollData: Partial<IPayroll> = {
            //////  this is for calculation of gross salary, total deductions and net salary based on the components provided in the file.
            grossSalary: (row.basic || 0) + (row.hra || 0) + (row.specialAllowance || 0) + (row.statutoryBonus || 0) + (row.byodPayment || 0) + (row.taskBasedIncentive || 0) + (row.arrearAmount || 0) + (row.specialPay || 0) + (row.miscellaneousPay || 0) + (row.otherAllowances || 0),
            totalDeductions: (row.providentFund || 0) + (row.professionalTax || 0) + (row.tds || 0) + (row.esic || 0) + (row.leaveWithoutPay || 0) + (row.lateWithoutPay || 0) + (row.lateArrivalDeductions || 0) + (row.loanRepayment || 0),
            netSalary: ((row.basic || 0) + (row.hra || 0) + (row.specialAllowance || 0) + (row.statutoryBonus || 0) + (row.byodPayment || 0) + (row.taskBasedIncentive || 0) + (row.arrearAmount || 0) + (row.specialPay || 0) + (row.miscellaneousPay || 0) + (row.otherAllowances || 0)) - ((row.providentFund || 0) + (row.professionalTax || 0) + (row.tds || 0) + (row.esic || 0) + (row.leaveWithoutPay || 0) + (row.lateWithoutPay || 0) + (row.lateArrivalDeductions || 0) + (row.loanRepayment || 0)), 

            ////
          userId: user._id,
          employeeId: user.professionalDetails.employeeId,
          month: row.month!,
          year: row.year!,
          
          salaryComponents: {
            basic: row.basic || 0,
            hra: row.hra || 0,
            allowances: {
              transport: row.conveyance || 0,
              medical: 0,
              special: row.specialAllowance || 0,
              foodAllowance: 0,
              statutoryBonus: row.statutoryBonus || 0,
              byodPayment: row.byodPayment || 0,
              taskBasedIncentive: row.taskBasedIncentive || 0,
              arrearAmount: row.arrearAmount || 0,
              arrearMonth: row.arrearMonth,
              specialPay: row.specialPay || 0,
              miscellaneous: row.miscellaneousPay || 0,
              nonWorkingDayCompensation: 0,
              other: row.otherAllowances || 0
            },
            deductions: {
              providentFund: row.providentFund || 0,
              professionalTax: row.professionalTax || 0,
              incomeTax: row.tds || 0,
              esi: row.esic || 0,
              leaveWithoutPay: row.leaveWithoutPay || 0,
              lateWithoutPay: row.lateWithoutPay || 0,
              lateArrivalDeductions: row.lateArrivalDeductions || 0,
              loanDeduction: row.loanRepayment || 0,
              other: 0
            },
            customEarnings: [],
            customDeductions: []
          },
          
          workingDays: row.workingDays || 30,
          presentDays: row.presentDays || 0,
          absentDays: 0,
          unpaidLeaveDays: row.lopDays || 0,
          
          generatedBy,
          isDraft: true,
          isGenerated: false,
          isPending: false
        };

        // Create payroll
        const payroll = await payrollDAL.create(payrollData);
        successful.push(payroll);

      } catch (error) {
        failed.push({
          row: i + 1,
          data: row,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { successful, failed };
  }
}