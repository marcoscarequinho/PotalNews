import type { VercelRequest, VercelResponse } from '@vercel/node';
<<<<<<< HEAD
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { registerRoutes } from './routes';
import { log } from './vite';

// Create a new Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
let server: any;
(async () => {
  server = await registerRoutes(app);
})();

// Create serverless express handler
const serverlessExpressHandler = serverlessExpress({ app });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Pass the Vercel request to the Express app
    return serverlessExpressHandler(req, res);
  } catch (error) {
    console.error('Error in Vercel handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
=======
import app from '../api/index';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // This is a simple wrapper to make Express work with Vercel's serverless functions
  // In a real deployment, you would want to use Vercel's native API routes
  // but for now, we'll pass the request to the Express app
  
  // Create a mock Express request and response objects
  // This is a simplified approach - in production, you might want to use
  // a more robust solution like @vendia/serverless-express
  
  return app(req, res);
>>>>>>> d8854f3ffc5422f02cd192b105bfd924de4cc9a7
}