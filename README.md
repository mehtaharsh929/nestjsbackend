NestJS Backend: User Management, Document Management, and Ingestion Control

Overview
This backend service is built using NestJS to handle:

User Authentication (Register, login, and role-based management)
Document Management (CRUD operations with document upload functionality)
Ingestion Control (Triggering ingestion process and managing ongoing ingestion tasks)
The service also integrates with a Python backend for handling ingestion processes through API calls or webhooks.

Key Features
Authentication APIs:

Register, login, and logout.
Handle different user roles (admin, editor, viewer).
User Management APIs (Admin only):

Managing user roles and permissions.
Document Management APIs:

CRUD operations for documents.
Upload documents with Multer.
Ingestion Trigger API:

Triggers the ingestion process in the Python backend.
Ingestion Management API:

Tracks and manages ongoing ingestion processes.
Tools & Libraries
NestJS: Framework for building efficient and scalable server-side applications.
TypeScript: For type-safe development.
TypeORM: For interacting with the PostgreSQL database.
PostgreSQL: Relational database for data storage.
JWT: For secure token-based authentication.
Multer: For handling file uploads.
Passport: For authentication strategies (JWT).
Bcrypt: For hashing passwords securely.
Class-Validator & Class-Transformer: For data validation.
Setup
Follow the steps below to get the project up and running:

1. Clone the Repository
bash
Copy code
git clone https://github.com/your-repository-url.git
cd your-project-folder
2. Install Dependencies
Run the following command to install the required dependencies:

bash
Copy code
npm install
3. Configure Environment Variables
Create a .env file in the root directory of the project. This file will contain the necessary environment variables for database connection and JWT configuration.

bash
Copy code
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_NAME=postgres
DATABASE_PASSWORD=root
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=3600
Make sure to replace the values of DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, and JWT_SECRET with appropriate values based on your environment.

4. Database Setup
Ensure that PostgreSQL is installed and running on your machine. You can create a new database using the following command:

bash
Copy code
psql -U postgres -c "CREATE DATABASE postgres;"
Alternatively, modify the DATABASE_NAME, DATABASE_USERNAME, and DATABASE_PASSWORD fields in the .env file to match your PostgreSQL setup.

5. Run the Application
Once the environment variables and database are configured, run the following command to start the application:

bash
Copy code
npm run start:dev
This will start the application in development mode. You can access the API at http://localhost:3000

Author
Harsh Mehta

For any inquiries or suggestions, feel free to contact me via email or GitHub.