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

---

## Tools & Libraries

| **Tool/Library** | **Purpose**                                     |
| ---------------- | ----------------------------------------------- |
| NestJS           | Framework for scalable server-side applications |
| TypeScript       | Type-safe development                           |
| TypeORM          | Database interaction with PostgreSQL            |
| PostgreSQL       | Relational database                             |
| JWT              | Secure token-based authentication               |
| Multer           | File uploads                                    |
| Passport         | Authentication strategies (JWT)                 |
| Bcrypt           | Secure password hashing                         |
| Class-Validator  | Data validation                                 |
| Jest             | Unit and integration testing framework          |
| Docker           | Containerization                                |
| GitHub Actions   | CI/CD and deployment automation                 |

---

## Setup Instructions

### **1. Clone the Repository**

git clone https://github.com/mehtaharsh929/nestjsbackend
cd nestjsbackend

### **2. Install Dependencies**

Run the following command to install the required dependencies:
npm install

### **3. Configure Environment Variables**

Create a .env file in the root directory of the project and add the following variables:

DATABASE_HOST=<your-database-host>
DATABASE_PORT=<your-database-port>
DATABASE_USERNAME=<your-database-username>
DATABASE_NAME=<your-database-name>
DATABASE_PASSWORD=<your-database-password>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=<jwt-expiration-time>

### **4. Start the Application**

npm run start:dev

## Testing the Application

This project includes unit tests and integration tests for critical modules such as authentication, user management, and document management. Testing is configured using Jest and Supertest.

### **1. To run all tests, execute**

npm run test

### **2. To run tests with a detailed report:**

npm run test:verbose

### **3. To run a specific test file**

npm run test src/<module>/<file>.spec.ts

### **4. To check test coverage:**

npm run test:cov

## Deployment Using Docker and GitHub Actions on AWS

### **1. Create Docker Configuration:**

Add a Dockerfile to the root directory

Add a .dockerignore file

node_modules
dist
.git
.github
.env

### **2. Create GitHub Actions Workflow:**

Add a GitHub Actions workflow file at .github/workflows/deploy.yml:

name: Deploy to AWS

on:
push:
branches: - main

jobs:
deploy:
runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Log in to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Build, Tag, and Push Docker image
      run: |
        docker build -t <your-repository-name>:latest .
        docker tag <your-repository-name>:latest <your-aws-account-id>.dkr.ecr.<region>.amazonaws.com/<your-repository-name>:latest
        docker push <your-aws-account-id>.dkr.ecr.<region>.amazonaws.com/<your-repository-name>:latest

    - name: Deploy to ECS
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: ecs-task.json
        service: <your-ecs-service-name>
        cluster: <your-ecs-cluster-name>
        wait-for-service-stability: true

### **3. AWS Configuration:**

Amazon ECS: Create a cluster and a service in ECS.

Amazon ECR: Create a repository to store your Docker images.

Secrets: Add AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) in GitHub Secrets
