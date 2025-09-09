<<<<<<< HEAD
import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverlessExpress from '@vendia/serverless-express';
import app from './index';

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
// Vercel API route handler
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Simple health check endpoint
  res.status(200).json({ 
    message: 'API is running', 
    timestamp: new Date().toISOString(),
    platform: 'Vercel'
  });
>>>>>>> d8854f3ffc5422f02cd192b105bfd924de4cc9a7
}