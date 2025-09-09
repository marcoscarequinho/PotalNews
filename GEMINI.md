# Project Overview

This is a full-stack news portal application built with React and Express. The system provides both an administrative interface for content management and a public portal for viewing published articles. The application features user authentication, role-based access control, content management with categories and articles, and file upload capabilities with Google Cloud Storage integration.

# Building and Running

**Development:**

To run the application in a development environment, use the following command:

```bash
npm run dev
```

**Production:**

To build the application for production, use the following command:

```bash
npm run build
```

To start the application in a production environment, use the following command:

```bash
npm run start
```

**Database:**

To push database changes, use the following command:

```bash
npm run db:push
```

# Development Conventions

## Frontend

*   **Framework:** React with TypeScript and Vite
*   **UI:** Shadcn/ui with Tailwind CSS
*   **State Management:** TanStack Query (React Query)
*   **Forms:** React Hook Form with Zod for validation
*   **Routing:** Wouter

## Backend

*   **Framework:** Express.js with TypeScript
*   **Database:** PostgreSQL with Drizzle ORM
*   **Authentication:** Replit Auth with OpenID Connect
*   **File Storage:** Google Cloud Storage
