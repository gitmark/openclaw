import type { VercelRequest, VercelResponse } from "@vercel/node";
import { enhanceWithClaude } from "../../src/server/claude.js";
import { createMessageSchema } from "../../src/server/schemas.js";
import { createMessage, getAllMessages } from "../_lib/kv.js";

/**
 * Messages endpoint
 * GET /api/messages - Get all messages
 * POST /api/messages - Create new message
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET - Fetch all messages
  if (req.method === "GET") {
    try {
      const messages = await getAllMessages();
      return res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch messages" });
    }
  }

  // POST - Create new message
  if (req.method === "POST") {
    try {
      // Validate request body
      const validatedData = createMessageSchema.parse(req.body);

      let aiResponse: string | undefined;

      // If AI enhancement is requested, call Claude API
      if (validatedData.useAI) {
        aiResponse = await enhanceWithClaude(validatedData.content);
      }

      // Save to Vercel KV
      const message = await createMessage(validatedData.content, aiResponse);

      return res.status(201).json({ success: true, data: message });
    } catch (error) {
      // Zod validation errors
      if (error instanceof Error && "issues" in error) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error,
        });
      }

      console.error("Error creating message:", error);
      return res.status(500).json({ success: false, error: "Failed to create message" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
