import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { registerRoutes } from './routes';

// Global app instance to reuse across invocations
let app: express.Application;
let isInitialized = false;

async function initializeApp() {
  if (!isInitialized) {
    console.log('Initializing Express app for Vercel...');

    app = express();

    // Middleware setup
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // CORS setup for production
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
      next();
    });

    // Register all routes
    await registerRoutes(app as any);

    isInitialized = true;
    console.log('Express app initialized successfully');
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[Vercel] ${req.method} ${req.url}`);

    // Initialize app if needed
    const expressApp = await initializeApp();

    // Create serverless express handler
    const serverlessHandler = serverlessExpress({ app: expressApp });

    // Handle the request
    return await serverlessHandler(req, res);
  } catch (error) {
    console.error('Error in Vercel handler:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
