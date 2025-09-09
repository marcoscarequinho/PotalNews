# Portal News

A modern news portal application built with React, TypeScript, and Express.js. This application features a public frontend for reading news articles and an admin panel for managing content.

## Features

- **Public Portal**: Browse and read news articles organized by categories
- **Admin Dashboard**: Manage articles, categories, and users
- **Authentication**: Secure login system for admin users
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Rich Text Editor**: Create and edit articles with a rich text editor
- **Image Upload**: Upload and manage images for articles
- **Statistics**: View analytics and statistics about articles and views
- **User Management**: Admins can manage editors and journalists

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication
- **Deployment**: Vercel (frontend) + Vercel Serverless Functions (API)
- **Storage**: Cloud storage for images

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or NeonDB for easy setup)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/marcoscarequinho/PotalNews.git
cd PotalNews
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/portalnews
SESSION_SECRET=your_session_secret_here
AUTH_MODE=mock
```

For production deployment, you'll need to set these variables in your Vercel dashboard.

### 4. Set up the database

```bash
npm run db:push
```

This will create the necessary tables in your database.

### 5. Create an admin user

```bash
npm run create-admin
```

This will create a default admin user that you can use to log in.

### 6. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` folder with the compiled frontend and backend files.

## Deployment to Vercel

### 1. Push to GitHub

Make sure your code is pushed to a GitHub repository.

### 2. Connect to Vercel

1. Go to [Vercel](https://vercel.com) and create an account or log in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Set Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

- `DATABASE_URL` - Your PostgreSQL connection string
- `SESSION_SECRET` - A random string for session encryption
- `AUTH_MODE` - Set to `replit` if using Replit authentication, or `mock` for development

### 4. Deploy

Click "Deploy" and Vercel will build and deploy your application.

## Project Structure

```
.
├── api/                 # Backend API code
│   ├── index.ts         # Express app entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── ...
├── client/              # Frontend code
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utility functions
│   └── index.html       # Main HTML file
├── shared/              # Shared code between frontend and backend
│   └── schema.ts        # Database schema
├── dist/                # Build output (generated)
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
└── vercel.json          # Vercel deployment configuration
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes
- `npm run create-admin` - Create an admin user

## Authentication

The application supports two authentication modes:

1. **Mock Mode** (`AUTH_MODE=mock`): All requests are automatically authenticated. Useful for development.
2. **Replit Mode** (`AUTH_MODE=replit`): Uses Replit's authentication system. Requires `REPLIT_DOMAINS` environment variable.

## Database Schema

The application uses the following tables:

- `users` - User accounts (admins, editors, journalists)
- `categories` - News categories
- `articles` - News articles
- `sessions` - User sessions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.