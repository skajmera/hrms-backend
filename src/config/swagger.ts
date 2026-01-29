import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HRMS Backend API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for Brain Inventory HRMS System',
      contact: {
        name: 'Brain Inventory',
        email: 'hr@braininventory.com',
        url: 'https://braininventory.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://68.183.245.11:5001/api/v1',//`http://localhost:${config.port}/api/v1`,
        description: 'Development Server'
      },
      {
        url: 'https://api.braininventory.com/api/v1',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'phone', 'dateOfBirth', 'gender'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            firstName: { type: 'string', example: 'sk' },
            lastName: { type: 'string', example: 'ajmera' },
            email: { type: 'string', format: 'email', example: 's.ajmera@braininventory.com' },
            phone: { type: 'string', example: '+919876543210' },
            dateOfBirth: { type: 'string', format: 'date', example: '1990-01-15' },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
            role: { type: 'string', enum: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE'], example: 'EMPLOYEE' },
            isActive: { type: 'boolean', example: true },
            professionalDetails: {
              type: 'object',
              properties: {
                employeeId: { type: 'string', example: 'EMP001' },
                designation: { type: 'string', example: 'Software Engineer' },
                department: { type: 'string', example: '507f1f77bcf86cd799439011' },
                joiningDate: { type: 'string', format: 'date', example: '2026-01-01' },
                employmentStatus: { type: 'string', enum: ['ACTIVE', 'PROBATION', 'RESIGNED', 'TERMINATED'], example: 'ACTIVE' }
              }
            }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH', 'ON_LEAVE'] },
            shift: { type: 'string', enum: ['MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE'] },
            checkInTime: { type: 'string', format: 'date-time' },
            checkOutTime: { type: 'string', format: 'date-time' },
            workingHours: { type: 'number', example: 8.5 }
          }
        },
        Leave: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            leaveType: { type: 'string', enum: ['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID'] },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            numberOfDays: { type: 'number', example: 3 },
            reason: { type: 'string', example: 'Family function' },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] }
          }
        },
        Payroll: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            month: { type: 'number', minimum: 1, maximum: 12 },
            year: { type: 'number' },
            grossSalary: { type: 'number', example: 50000 },
            totalDeductions: { type: 'number', example: 5000 },
            netSalary: { type: 'number', example: 45000 },
            paymentStatus: { type: 'string', enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED'] }
          }
        },
        Announcement: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'Company Holiday Announcement' },
            content: { type: 'string', example: 'Office will remain closed on...' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            startDate: { type: 'string', format: 'date' },
            expiryDate: { type: 'string', format: 'date' },
            isPinned: { type: 'boolean', example: false }
          }
        },
        Department: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Engineering' },
            code: { type: 'string', example: 'ENG' },
            description: { type: 'string', example: 'Engineering Department' },
            parentDepartment: { type: 'string', nullable: true },
            headOfDepartment: { type: 'string' },
            employeeCount: { type: 'number', example: 25 }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['success', 'error'] },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                data: { type: 'array', items: {} },
                pagination: {
                  type: 'object',
                  properties: {
                    currentPage: { type: 'number' },
                    totalPages: { type: 'number' },
                    totalItems: { type: 'number' },
                    itemsPerPage: { type: 'number' },
                    hasNextPage: { type: 'boolean' },
                    hasPrevPage: { type: 'boolean' }
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Attendance', description: 'Attendance management endpoints' },
      { name: 'Leave', description: 'Leave management endpoints' },
      { name: 'Payroll', description: 'Payroll management endpoints' },
      { name: 'Announcements', description: 'Announcement management endpoints' },
      { name: 'Departments', description: 'Department management endpoints' },
      { name: 'Dashboard', description: 'Dashboard and statistics endpoints' }
    ]
  },
  apis: ['./src/app/modules/**/*.route.ts', './src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);