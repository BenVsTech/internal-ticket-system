# Internal Ticket System

A full-stack internal ticket management system built with Next.js, TypeScript, PostgreSQL, and NextAuth. This application allows teams to create, manage, and track support tickets with user authentication, team management, and email notifications.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v12 or higher)
- A **SMTP email service** account (Gmail, SendGrid, etc.)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internal-ticket-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory of the project with the following variables:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DATABASE=internal_ticket_system

   # NextAuth Configuration
   NEXTAUTH_SECRET=your_secret_key_here

   # SMTP Email Configuration
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password_or_app_password
   SMTP_SERV=gmail
   ```

   **Environment Variables Explained:**
   
   - **DB_HOST**: PostgreSQL server hostname (usually `localhost` for local development)
   - **DB_PORT**: PostgreSQL server port (default is `5432`)
   - **DB_USER**: PostgreSQL username with database creation privileges
   - **DB_PASSWORD**: PostgreSQL user password
   - **DATABASE**: Name of the database to use (will be created automatically)
   - **NEXTAUTH_SECRET**: A random secret string used to encrypt JWT tokens. Generate one using: `openssl rand -base64 32`
   - **SMTP_USER**: Email address for sending notifications
   - **SMTP_PASS**: Email password or app-specific password (for Gmail, use an App Password)
   - **SMTP_SERV**: SMTP service name (e.g., `gmail`, `outlook`, `sendgrid`)

4. **Create the database and schema**
   ```bash
   npm run create-local-db
   ```
   This script will:
   - Connect to your PostgreSQL server
   - Create the `internal_ticket_system` database if it doesn't exist
   - Create all necessary tables (team, users, ticket, comment)
   - Set up database triggers for password encryption and timestamp updates

5. **Create a test user** (optional, for testing)
   ```bash
   npm run create-test-user
   ```
   This creates a test user with:
   - Email: `test@test.com`
   - Password: `test`
   - Team: "Test Team"

6. **Create sample tickets** (optional, for testing)
   ```bash
   npm run create-sample-tickets
   ```
   This creates 3 sample tickets for testing purposes.

7. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## NPM Scripts

The following npm scripts are available:

### `npm run dev`
Starts the Next.js development server with hot-reloading enabled. The server runs on `http://localhost:3000` by default.

**Usage:**
```bash
npm run dev
```

### `npm run build`
Creates an optimized production build of the application. This compiles TypeScript, optimizes React components, and generates static assets.

**Usage:**
```bash
npm run build
```

### `npm run start`
Starts the production server. **Note:** You must run `npm run build` first before using this command.

**Usage:**
```bash
npm run build
npm run start
```

### `npm run lint`
Runs ESLint to check your code for potential errors, code quality issues, and style inconsistencies.

**Usage:**
```bash
npm run lint
```

### `npm run create-local-db`
Creates the local PostgreSQL database and all required tables with proper schema, triggers, and constraints. This script:
- Connects to PostgreSQL using the `postgres` database
- Checks if the database already exists
- Creates the `internal_ticket_system` database if needed
- Creates all tables: `team`, `users`, `ticket`, and `comment`
- Sets up database triggers for automatic password encryption and timestamp updates

**Usage:**
```bash
npm run create-local-db
```

**Note:** Ensure your PostgreSQL server is running and the credentials in your `.env` file are correct. The user specified in `DB_USER` must have database creation privileges.

### `npm run create-test-user`
Creates a test user account and associated team for development and testing purposes. The test user has:
- **Name:** Test User
- **Email:** test@test.com
- **Password:** test
- **Team:** Test Team (created automatically)

**Usage:**
```bash
npm run create-test-user
```

**Note:** This script requires the database to be set up first (run `npm run create-local-db`). The test user will be assigned to user ID 1.

### `npm run create-sample-tickets`
Creates sample ticket data in the database for testing and demonstration purposes. This script creates 3 sample tickets:
- Sample Ticket 1
- Sample Ticket 2
- Sample Ticket 3

All tickets are created with status "open" and are assigned to user ID 1.

**Usage:**
```bash
npm run create-sample-tickets
```

**Note:** This script requires:
1. The database to be set up (run `npm run create-local-db`)
2. A test user to exist (run `npm run create-test-user`)

## Getting Started

After completing the installation steps:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - If you created a test user, log in with:
     - Email: `test@test.com`
     - Password: `test`

3. **Explore the features:**
   - Create and manage tickets
   - Assign tickets to team members
   - Add comments to tickets
   - Manage teams and users
   - Update ticket status

## Project Structure

```
internal-ticket-system/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── comments/     # Comment CRUD operations
│   │   │   ├── teams/        # Team CRUD operations
│   │   │   ├── tickets/      # Ticket CRUD operations
│   │   │   └── users/        # User CRUD operations
│   │   ├── components/       # React components
│   │   ├── login/           # Login page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── lib/
│   │   ├── core/            # Core functionality
│   │   │   ├── auth.ts      # NextAuth configuration
│   │   │   ├── database.ts  # Database connection
│   │   │   ├── email.ts     # Email service
│   │   │   └── queries.ts   # Database queries
│   │   └── service/         # Business logic services
│   ├── types/               # TypeScript type definitions
│   └── util/                # Utility functions and constants
├── script/                  # Setup and utility scripts
│   ├── localDatabaseCreation.ts
│   ├── testUserCreation.ts
│   └── sampleDataCreation.ts
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **NextAuth v5** - Authentication library
- **Nodemailer** - Email sending functionality
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready` or check your PostgreSQL service
- Verify your database credentials in the `.env` file
- Make sure the `DB_USER` has the necessary permissions to create databases

### Email Not Sending
- For Gmail, you may need to use an App Password instead of your regular password
- Verify your SMTP service settings match your email provider's requirements
- Check that `SMTP_SERV` matches a service supported by Nodemailer

### Port Already in Use
- If port 3000 is already in use, Next.js will automatically try the next available port
- You can specify a custom port: `npm run dev -- -p 3001`

