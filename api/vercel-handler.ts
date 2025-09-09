import type { VercelRequest, VercelResponse } from '@vercel/node';
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
}