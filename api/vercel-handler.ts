import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../api/index';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // This is a simple wrapper to make Express work with Vercel's serverless functions
  // In a real deployment, you would want to use Vercel's native API routes
  // but for now, we'll pass the request to the Express app
  
  // Create a mock Express request and response objects
  // This is a simplified approach - in production, you might want to use
  // a more robust solution like @vendia/serverless-express
  
  return app(req, res);
}