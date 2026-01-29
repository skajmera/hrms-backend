# HRMS Backend - Brain Inventory

A comprehensive Human Resource Management System built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- 🔐 **Authentication & Authorization** - JWT-based with role management
- 👥 **User Management** - Complete employee lifecycle
- 📅 **Attendance System** - Biometric integration ready
- 🏖️ **Leave Management** - Request/Approval workflow
- 💰 **Payroll System** - Automated salary slip generation
- 📢 **Announcements** - Organization-wide communication
- 🏢 **Department Management** - Hierarchical structure
- 📊 **Dashboard** - Real-time analytics and insights

## 📦 Installation

1. **Install dependencies:**
```bash
   npm install
```

2. **Configure environment:**
```bash
   cp .env.example .env
   # Edit .env with your configuration
```

3. **Run development server:**
```bash
   npm run dev
```

4. **Build for production:**
```bash
   npm run build
   npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token

### Users
- `GET /api/v1/hr/users` - Get all users
- `GET /api/v1/hr/users/:id` - Get user by ID
- `POST /api/v1/hr/users` - Create user
- `PUT /api/v1/hr/users/:id` - Update user
- `DELETE /api/v1/hr/users/:id` - Delete user

### Attendance
- `GET /api/v1/hr/attendance` - Get attendance records
- `POST /api/v1/hr/attendance/mark` - Mark attendance
- `GET /api/v1/hr/attendance/report` - Get attendance report

### Leave
- `GET /api/v1/hr/leave` - Get leave requests
- `POST /api/v1/hr/leave` - Apply for leave
- `PUT /api/v1/hr/leave/:id/approve` - Approve leave
- `PUT /api/v1/hr/leave/:id/reject` - Reject leave

### Payroll
- `GET /api/v1/hr/payroll` - Get payroll records
- `POST /api/v1/hr/payroll/generate` - Generate payslips

### Departments
- `GET /api/v1/hr/departments` - Get departments
- `POST /api/v1/hr/departments` - Create department
- `GET /api/v1/hr/departments/tree` - Get hierarchy

### Dashboard
- `GET /api/v1/hr/dashboard/stats` - Dashboard statistics
- `GET /api/v1/hr/dashboard/birthdays` - Birthday list
- `GET /api/v1/hr/dashboard/new-hires` - New hires

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Validation:** express-validator

## 📁 Project Structure
```
hrms-backend/
├── src/
│   ├── app/
│   │   └── modules/       # Feature modules
│   ├── config/            # Configuration
│   ├── shared/
│   │   ├── interfaces/    # TypeScript interfaces
│   │   ├── models/        # Mongoose models
│   │   ├── dal/          # Data Access Layer
│   │   ├── middlewares/   # Express middlewares
│   │   └── utils/         # Utility functions
│   ├── routes/            # Route definitions
│   ├── app.ts            # Express app
│   └── server.ts         # Server entry
├── package.json
└── tsconfig.json
```

## 🔐 User Roles

- **Super Admin** - Full system access
- **HR Admin** - HR operations management
- **Manager** - Team management & approvals
- **Employee** - Self-service portal

## 📝 License

MIT © Brain Inventory