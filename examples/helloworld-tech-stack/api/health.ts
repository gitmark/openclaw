import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Health check endpoint
 * GET /api/health
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    success: true,
    message: "Server is running on Vercel!",
    technologies: {
      runtime: "Node.js (Serverless)",
      language: "TypeScript",
      framework: "Vercel Functions",
      database: "Vercel KV (Redis)",
      validation: "Zod",
      ai: "Anthropic Claude",
    },
  });
}
