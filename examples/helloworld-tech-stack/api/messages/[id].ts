import type { VercelRequest, VercelResponse } from "@vercel/node";
import { messageIdSchema } from "../../src/server/schemas.js";
import { getMessageById } from "../_lib/kv.js";

/**
 * Get message by ID
 * GET /api/messages/:id
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validate the ID parameter using Zod
    const { id } = messageIdSchema.parse({ id: req.query.id });

    const message = await getMessageById(id);

    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error fetching message:", error);
    return res.status(400).json({ success: false, error: "Invalid message ID" });
  }
}
