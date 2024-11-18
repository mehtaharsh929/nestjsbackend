# NestJS Backend: User Management, Document Management, and Ingestion Control

## Overview
This backend service, built using **NestJS**, handles the following core functionalities:

- **User Authentication**: Register, login, logout, and role-based management.
- **User Management**: Manage user roles and permissions (Admin only).
- **Document Management**: CRUD operations and file upload.
- **Ingestion Control**: Trigger ingestion processes and manage ongoing tasks via integration with a Python backend.

---

## Key Features

### **Authentication APIs**
- Register, login, and logout.
- Role-based access control (Admin, Editor, Viewer).

### **User Management APIs** (Admin only)
- Create, update, delete, and manage user roles and permissions.

### **Document Management APIs**
- Perform CRUD operations on documents.
- Upload documents using **Multer**.

### **Ingestion Management**
- Trigger ingestion processes via API calls to a Python backend.
- Track and manage ongoing ingestion tasks.

---

## Tools & Libraries

| **Tool/Library**   | **Purpose**                                      |
|---------------------|--------------------------------------------------|
| NestJS             | Framework for scalable server-side applications |
| TypeScript         | Type-safe development                           |
| TypeORM            | Database interaction with PostgreSQL            |
| PostgreSQL         | Relational database                             |
| JWT                | Secure token-based authentication               |
| Multer             | File uploads                                    |
| Passport           | Authentication strategies (JWT)                 |
| Bcrypt             | Secure password hashing                         |
| Class-Validator    | Data validation                                 |
| Class-Transformer  | Data transformation                             |

---

## Setup Instructions

### **1. Clone the Repository**
```bash
git clone https://github.com/mehtaharsh929/nestjsbackend
cd nestjsbackend

### **2. Install Dependencies**
Run the following command to install the required dependencies:
npm install

### **3. Install Dependencies**
Configure Environment Variables
Create a .env file in the root directory of the project and add the following variables:
DATABASE_HOST
DATABASE_PORT
DATABASE_USERNAME
DATABASE_NAME
DATABASE_PASSWORD
JWT_SECRET
JWT_EXPIRES_IN

### **5. Start the Application
npm run start:dev

