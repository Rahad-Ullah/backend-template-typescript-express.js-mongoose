# Backend Template for TypeScript, Express and Mongoose

This is a template project for backend development using Typescript, Node.js, Express, Mongoose, Bcrypt, JWT, NodeMailer, Multer, ESLint, and Prettier. The aim is to reduce setup time for new backend projects.

## Features

- **Authentication API:** Complete authentication system using JWT for secure token-based authentication and bcrypt for password hashing.
- **File Upload:** Implemented using Multer with efficient file handling and short-term storage.
- **Data Validation:** Robust data validation using Zod and Mongoose schemas.
- **Code Quality:** Ensured code readability and quality with ESLint and Prettier.
- **Email Service:** Sending emails through NodeMailer.
- **File Handling:** Efficient file deletion using `fs.unlink`.
- **Environment Configuration:** Easy configuration using a `.env` file.
- **Logging:** Logging with Winston and file rotation using DailyRotateFile.
- **API Request Logging:** Logging API requests using Morgan.

## Tech Stack

- Typescript
- Node.js
- Express
- Mongoose
- Bcrypt
- JWT
- NodeMailer
- Multer
- ESLint
- Prettier
- Winston
- Daily-winston-rotate-file
- Morgen
- Socket

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Rahad-Ullah/backend-template-typescript-mongoose-express.git
   cd backend-template-typescript-mongoose-express
   ```

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Using yarn:

   ```bash
   yarn
   ```

3. **Create a `.env` file:**

   In the root directory of the project, create a `.env` file and add the following variables. Adjust the values according to your setup.

   ```env
   SERVER_NAME=template
   NODE_ENV=development
   DATABASE_URL=mongodb://127.0.0.1:27017/template
   IP_ADDRESS=10.10.7.7
   PORT=5000      # for production after build (`npm start`)
   PORT_DEV=5001  # for development (`npm run dev`)

   # Bcrypt
   BCRYPT_SALT_ROUNDS=12

   # JWT
   JWT_SECRET=jwt_secret
   JWT_EXPIRE_IN=1d

   # Email
   EMAIL_FROM=your_company_email@gmail.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=mkqcfjeqloothyax
   EMAIL_PORT=587
   EMAIL_HOST=smtp.gmail.com

   # Admin credentials
   SUPER_ADMIN_EMAIL=super.admin@gmail.com
   SUPER_ADMIN_PASSWORD=P@ssword123
   ```

4. **Run the project:**

   Using npm:

   ```bash
   npm run dev
   ```

   Using yarn:

   ```bash
   yarn dev
   ```

### Running the Tests

Explain how to run the automated tests for this system.

```bash
npm test
```
