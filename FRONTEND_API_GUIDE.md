# HRMS Backend API - Frontend Integration Guide

## 📚 Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication Flow](#authentication-flow)
3. [API Base URL](#api-base-url)
4. [Authentication Headers](#authentication-headers)
5. [Response Format](#response-format)
6. [Error Handling](#error-handling)
7. [Complete API Endpoints](#complete-api-endpoints)
8. [Code Examples](#code-examples)
9. [Best Practices](#best-practices)

---

## 🚀 Getting Started

### API Documentation
- **Swagger UI**: `https://rs444324-5000.inc1.devtunnels.ms/api/v1/docs`
- **Swagger JSON**: `https://rs444324-5000.inc1.devtunnels.ms/api/v1/docs.json`

### Base URLs
- **Development**: `https://rs444324-5000.inc1.devtunnels.ms/api/v1`
- **Production**: `https://api.braininventory.com/api/v1`

---

## 🔐 Authentication Flow

### Step 1: Register/Login
```javascript
// Login Request
POST /auth/login
Content-Type: application/json

{
  "email": "s.ajmera@braininventory.com",
  "password": "Sk@12345"
}

// Response
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 2: Store Token
```javascript
// Store in localStorage or secure cookie
localStorage.setItem('accessToken', response.data.token);
localStorage.setItem('refreshToken', response.data.refreshToken);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### Step 3: Use Token in Requests
```javascript
// Add to all API requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  'Content-Type': 'application/json'
}
```

---

## 🌐 API Base URL
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rs444324-5000.inc1.devtunnels.ms/api/v1';
```

---

## 📡 Authentication Headers

### Required Headers for Protected Routes
```javascript
{
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

---

## 📦 Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Paginated Response
```json
{
  "status": "success",
  "message": "Data retrieved successfully",
  "data": {
    "data": [ /* array of items */ ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message here",
  "error": "Detailed error information"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes
- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Invalid/expired token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Duplicate resource)
- `500` - Internal Server Error

### Error Handling Example
```javascript
try {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.status === 'error') {
    throw new Error(data.message);
  }
  
  return data;
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error in UI
}
```

---

## 📋 Complete API Endpoints

### 1. AUTHENTICATION

#### Register User
```
POST /auth/register
Body: { firstName, lastName, email, password, phone, dateOfBirth, gender, currentAddress, professionalDetails }
Access: Public
```

#### Login
```
POST /auth/login
Body: { email, password }
Access: Public
```

#### Logout
```
POST /auth/logout
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get Profile
```
GET /auth/profile
Headers: Authorization: Bearer {token}
Access: Private
```

#### Forgot Password
```
POST /auth/forgot-password
Body: { email }
Access: Public
```

#### Reset Password
```
POST /auth/reset-password
Body: { token, password }
Access: Public
```

#### Refresh Token
```
POST /auth/refresh
Body: { refreshToken }
Access: Public
```

---

### 2. USERS

#### Get All Users
```
GET /hr/users?page=1&limit=10&sortBy=createdAt&sortOrder=desc
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

#### Get User by ID
```
GET /hr/users/:id
Headers: Authorization: Bearer {token}
Access: Private
```

#### Create User
```
POST /hr/users
Body: { /* user data */ }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Update User
```
PUT /hr/users/:id
Body: { /* update data */ }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Delete User
```
DELETE /hr/users/:id
Headers: Authorization: Bearer {token}
Access: Super Admin
```

#### Search Users
```
GET /hr/users/search?q=searchTerm
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

#### Get User Statistics
```
GET /hr/users/stats
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

---

### 3. ATTENDANCE

#### Mark Attendance
```
POST /hr/attendance/mark
Body: { userId, date, status, shift, checkInTime, checkOutTime }
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get All Attendance
```
GET /hr/attendance?page=1&limit=10&userId=xxx&startDate=2026-01-01&endDate=2026-01-31
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

#### Get Today's Attendance
```
GET /hr/attendance/today
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

#### Get Attendance Report
```
GET /hr/attendance/report/:userId/:month/:year
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

#### Update Attendance
```
PUT /hr/attendance/:id
Body: { status, checkInTime, checkOutTime, remarks }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

---

### 4. LEAVE

#### Apply for Leave
```
POST /hr/leave
Body: { userId, leaveType, startDate, endDate, reason }
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get All Leaves
```
GET /hr/leave?page=1&limit=10&status=PENDING
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get Pending Leaves
```
GET /hr/leave/pending
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

#### Get Employees on Leave Today
```
GET /hr/leave/on-leave-today
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

#### Get Leave Balance
```
GET /hr/leave/balance/:userId/:year
Headers: Authorization: Bearer {token}
Access: Private
```

#### Approve Leave
```
PUT /hr/leave/:id/approve
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

#### Reject Leave
```
PUT /hr/leave/:id/reject
Body: { rejectionReason }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin, Manager
```

---

### 5. PAYROLL

#### Generate Payroll
```
POST /hr/payroll/generate
Body: { userId, month, year, salaryComponents, workingDays, presentDays }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Get All Payroll
```
GET /hr/payroll?page=1&limit=10&month=1&year=2026
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Get User Payroll History
```
GET /hr/payroll/user/:userId?limit=12
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get Payroll Statistics
```
GET /hr/payroll/stats/:month/:year
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Mark as Paid
```
PUT /hr/payroll/:id/mark-paid
Body: { paymentMode, transactionId }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

---

### 6. ANNOUNCEMENTS

#### Create Announcement
```
POST /hr/announcements
Body: { title, content, priority, startDate, expiryDate, targetAudience }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Get All Announcements
```
GET /hr/announcements?page=1&limit=10
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get My Announcements
```
GET /hr/announcements/my-announcements
Headers: Authorization: Bearer {token}
Access: Private
```

#### Update Announcement
```
PUT /hr/announcements/:id
Body: { /* update data */ }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Delete Announcement
```
DELETE /hr/announcements/:id
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Mark as Viewed
```
POST /hr/announcements/:id/view
Headers: Authorization: Bearer {token}
Access: Private
```

#### Toggle Pin
```
PUT /hr/announcements/:id/toggle-pin
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

---

### 7. DEPARTMENTS

#### Create Department
```
POST /hr/departments
Body: { name, code, description, parentDepartment, headOfDepartment }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Get All Departments
```
GET /hr/departments?page=1&limit=10
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get Department Tree
```
GET /hr/departments/tree
Headers: Authorization: Bearer {token}
Access: Private
```

#### Update Department
```
PUT /hr/departments/:id
Body: { /* update data */ }
Headers: Authorization: Bearer {token}
Access: HR Admin, Super Admin
```

#### Delete Department
```
DELETE /hr/departments/:id
Headers: Authorization: Bearer {token}
Access: Super Admin
```

---

### 8. DASHBOARD

#### Get Dashboard Statistics
```
GET /hr/dashboard/stats
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get Birthdays
```
GET /hr/dashboard/birthdays
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get New Hires
```
GET /hr/dashboard/new-hires?days=30
Headers: Authorization: Bearer {token}
Access: Private
```

#### Get Recent Announcements
```
GET /hr/dashboard/announcements
Headers: Authorization: Bearer {token}
Access: Private
```

---

## 💻 Code Examples

### React + Axios Setup

#### 1. Create API Service
```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rs444324-5000.inc1.devtunnels.ms/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data.data;
        localStorage.setItem('accessToken', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

#### 2. Auth Service
```javascript
// src/services/auth.service.js
import apiClient from './api';
export const authService = {
// Login
login: async (email, password) => {
const response = await apiClient.post('/auth/login', { email, password });
if (response.data.status === 'success') {
localStorage.setItem('accessToken', response.data.data.token);
localStorage.setItem('refreshToken', response.data.data.refreshToken);
localStorage.setItem('user', JSON.stringify(response.data.data.user));
}
return response.data;
},
// Register
register: async (userData) => {
const response = await apiClient.post('/auth/register', userData);
return response.data;
},
// Logout
logout: async () => {
await apiClient.post('/auth/logout');
localStorage.clear();
},
// Get Profile
getProfile: async () => {
const response = await apiClient.get('/auth/profile');
return response.data;
},
// Check if logged in
isAuthenticated: () => {
return !!localStorage.getItem('accessToken');
},
// Get current user
getCurrentUser: () => {
const user = localStorage.getItem('user');
return user ? JSON.parse(user) : null;
},
};
#### 3. User Service
```javascript
// src/services/user.service.js
import apiClient from './api';

export const userService = {
  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await apiClient.get('/hr/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await apiClient.get(`/hr/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await apiClient.post('/hr/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/hr/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/hr/users/${id}`);
    return response.data;
  },

  // Search users
  searchUsers: async (searchTerm) => {
    const response = await apiClient.get('/hr/users/search', {
      params: { q: searchTerm },
    });
    return response.data;
  },
};
```

#### 4. Attendance Service
```javascript
// src/services/attendance.service.js
import apiClient from './api';

export const attendanceService = {
  // Mark attendance
  markAttendance: async (attendanceData) => {
    const response = await apiClient.post('/hr/attendance/mark', attendanceData);
    return response.data;
  },

  // Get today's attendance
  getTodayAttendance: async () => {
    const response = await apiClient.get('/hr/attendance/today');
    return response.data;
  },

  // Get attendance report
  getAttendanceReport: async (userId, month, year) => {
    const response = await apiClient.get(`/hr/attendance/report/${userId}/${month}/${year}`);
    return response.data;
  },
};
```

#### 5. Leave Service
```javascript
// src/services/leave.service.js
import apiClient from './api';

export const leaveService = {
  // Apply for leave
  applyLeave: async (leaveData) => {
    const response = await apiClient.post('/hr/leave', leaveData);
    return response.data;
  },

  // Get pending leaves
  getPendingLeaves: async () => {
    const response = await apiClient.get('/hr/leave/pending');
    return response.data;
  },

  // Approve leave
  approveLeave: async (leaveId) => {
    const response = await apiClient.put(`/hr/leave/${leaveId}/approve`);
    return response.data;
  },

  // Reject leave
  rejectLeave: async (leaveId, reason) => {
    const response = await apiClient.put(`/hr/leave/${leaveId}/reject`, {
      rejectionReason: reason,
    });
    return response.data;
  },

  // Get leave balance
  getLeaveBalance: async (userId, year) => {
    const response = await apiClient.get(`/hr/leave/balance/${userId}/${year}`);
    return response.data;
  },
};
```

#### 6. React Component Examples
```javascript
// Login Component
import React, { useState } from 'react';
import { authService } from '../services/auth.service';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      console.log('Login successful:', response);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```
```javascript
// Dashboard Component with Stats
import React, { useEffect, useState } from 'react';
import apiClient from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiClient.get('/hr/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <p>{stats.totalEmployees}</p>
          </div>
          <div className="stat-card">
            <h3>Present Today</h3>
            <p>{stats.attendance.present}</p>
          </div>
          <div className="stat-card">
            <h3>On Leave</h3>
            <p>{stats.attendance.onLeave}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Leave Requests</h3>
            <p>{stats.leaves.pending}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. Token Management
```javascript
// Store tokens securely
localStorage.setItem('accessToken', token);

// Clear on logout
localStorage.clear();

// Auto-refresh expired tokens
// (Already implemented in axios interceptor)
```

### 2. Error Handling
```javascript
try {
  const response = await apiService.someMethod();
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.data.message);
  } else if (error.request) {
    // Request made but no response
    console.error('Network error');
  } else {
    // Something else happened
    console.error('Error:', error.message);
  }
}
```

### 3. Loading States
```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await apiService.getData();
    // Handle data
  } finally {
    setLoading(false);
  }
};
```

### 4. Pagination Handling
```javascript
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const fetchUsers = async () => {
  const response = await userService.getAllUsers({ page, limit: 10 });
  setHasMore(response.data.pagination.hasNextPage);
  // Handle data
};
```

### 5. Role-Based Access
```javascript
const user = authService.getCurrentUser();

// Check role before showing UI
{user.role === 'HR_ADMIN' && <AdminPanel />}

// Or check permissions
const canViewPayroll = ['SUPER_ADMIN', 'HR_ADMIN'].includes(user.role);
```

---

## 📞 Support

For any issues or questions:
- **Email**: hr@braininventory.com
- **Documentation**: https://rs444324-5000.inc1.devtunnels.ms/api/v1/docs
- **Issue Tracker**: [GitHub Issues]

---

## 🔄 API Versioning

Current Version: **v1**

All endpoints are prefixed with `/api/v1`

---

## 📝 Changelog

### Version 1.0.0 (2026-01-15)
- Initial release
- Complete HRMS functionality
- Authentication & Authorization
- User Management
- Attendance System
- Leave Management
- Payroll System
- Announcements
- Department Management
- Dashboard & Analytics

---

**Happy Coding! 🚀**



## **🎯 FINAL API STRUCTURE**
```
Employee APIs (All users can access their own data):
✅ GET    /api/v1/employee/profile
✅ PUT    /api/v1/employee/profile
✅ POST   /api/v1/employee/profile/change-password
✅ POST   /api/v1/employee/attendance/mark
✅ GET    /api/v1/employee/attendance
✅ GET    /api/v1/employee/attendance/summary/:month/:year
✅ POST   /api/v1/employee/leave/apply
✅ GET    /api/v1/employee/leave
✅ GET    /api/v1/employee/leave/balance/:year
✅ PUT    /api/v1/employee/leave/:id/cancel
✅ GET    /api/v1/employee/payroll
✅ GET    /api/v1/employee/payroll/:id
✅ GET    /api/v1/employee/dashboard

HR/Admin APIs (Only HR Admin + Super Admin):
✅ All previous /api/v1/hr/* endpoints