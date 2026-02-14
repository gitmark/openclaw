import { kv } from "@vercel/kv";
import type { Message } from "../../src/shared/types.js";

/**
 * Vercel KV: Redis-compatible key-value database
 *
 * Replaces SQLite for serverless environments.
 * Data is stored in Redis with automatic scaling.
 */

// Counter for auto-incrementing message IDs
const MESSAGE_COUNTER_KEY = "message:counter";
const MESSAGE_LIST_KEY = "messages:list";

/**
 * Get next message ID
 */
async function getNextId(): Promise<number> {
  const id = await kv.incr(MESSAGE_COUNTER_KEY);
  return id;
}

/**
 * Create a new message
 */
export async function createMessage(content: string, aiResponse?: string): Promise<Message> {
  const id = await getNextId();
  const message: Message = {
    id,
    content,
    aiEnhanced: !!aiResponse,
    aiResponse,
    createdAt: new Date().toISOString(),
  };

  // Store message by ID
  await kv.set(`message:${id}`, JSON.stringify(message));

  // Add to list of all message IDs (for getAllMessages)
  await kv.lpush(MESSAGE_LIST_KEY, id);

  // Trim to keep only last 50 messages
  await kv.ltrim(MESSAGE_LIST_KEY, 0, 49);

  return message;
}

/**
 * Get all messages
 */
export async function getAllMessages(): Promise<Message[]> {
  // Get list of message IDs
  const messageIds = await kv.lrange(MESSAGE_LIST_KEY, 0, 49);

  if (!messageIds || messageIds.length === 0) {
    return [];
  }

  // Fetch all messages in parallel
  const messages = await Promise.all(
    messageIds.map(async (id) => {
      const data = await kv.get(`message:${id}`);
      return data ? JSON.parse(data as string) : null;
    }),
  );

  return messages.filter(Boolean) as Message[];
}

/**
 * Get message by ID
 */
export async function getMessageById(id: number): Promise<Message | null> {
  const data = await kv.get(`message:${id}`);
  return data ? JSON.parse(data as string) : null;
}
