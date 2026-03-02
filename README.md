# Mini-Workforce-Tracker

**Live Demo:** https://baalcut.shop/

A Role-Based Attendance Management System built with:

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MySQL
- Authentication: JWT

---

##  User Roles

-  Employee
  - Mark daily attendance


-  Manager
  - View all employee attendance
  - Search employees
  - Pagination support

-  Admin
  - Full access to attendance data

---

##  Tech Stack

Frontend:
- React
- Axios
- Context API
- Vite

Backend:
- Node.js
- Express
- MySQL2
- JWT
- bcrypt

---

## 📦 Features

- Role-based access control
- JWT authentication
- Prevent duplicate attendance
- Pagination
- Search filter
- Secure API

---

## 🗂 Project Structure

```
backend/
 ├── controllers/
 ├── middleware/
 ├── routes/
 ├── config/
 └── server.js

frontend/
 ├── src/
 ├── context/
 ├── components/
 └── pages/
```

---

## ⚙️ Setup Instructions

See Setup Steps below.


## 🔧 Backend Setup

1. Clone the repository

```
git clone https://github.com/anshulkumar15/Mini-Workforce-Tracker.git
cd Mini-Workforce-Tracker/l2back
```

2. Install dependencies

```
npm install
```

3. Create `.env` file

```
JWT_SECRET=4837483843ury73br7
PORT=3000
# mysql
DB_HOST=localhost
DB_USER=root    
DB_PASSWORD=""
DB_NAME=l2db
```

4. Import database

```
mysql -u root -p < database.sql
```

5. Start server

```
node src/server.js
```

---

## 💻 Frontend Setup

```
cd ../l2front
npm install
```

Create `.env`

```
VITE_API_URL=http://localhost:3000
```

Run frontend

```
npm run dev
```

---

## 🌍 Access App

Frontend:
```
http://localhost:5173
```

Backend:
```
http://localhost:3000
```

## 🗂 API Routes

### 🔐 Auth
POST `/api/login`

---

### 👨‍💼 Employee Management

POST `/api/addEmployee` (Admin only)  
GET `/api/employees`  
POST `/api/employees/upload` (Admin only)

---

### 📅 Attendance

POST `/api/attendance` (Employee only)  
GET `/api/getattendance` (Manager/Admin)

---

### 📝 Work Logs

POST `/api/addworklogs` (Employee only)  
GET `/api/worklogs` (Manager/Admin)

---

## 🔒 Authentication

All protected routes require:

```
Authorization: Bearer <token>
```

JWT payload:

```
{
  id: user.id,
  role: user.role
}
```

---

## 🗄 Database Schema

### users
- id (PK)
- name
- email (unique)
- password
- role (Admin, Manager, Employee)
- created_at

### employees
- id (PK)
- user_id (FK → users.id)
- department
- created_by

### attendance
- id (PK)
- employee_id (FK → employees.id)
- date
- UNIQUE(employee_id, date)

### work_logs
- id (PK)
- employee_id (FK → employees.id)
- title
- description
- hours
- created_at



