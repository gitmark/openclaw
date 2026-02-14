import { z } from 'zod';

/**
 * Zod: TypeScript-first schema validation library
 *
 * Zod allows you to define schemas that validate data at runtime
 * while also providing TypeScript type inference. This is crucial
 * for validating API inputs and ensuring type safety.
 */

// Schema for creating a new message
export const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty').max(1000, 'Message too long'),
  useAI: z.boolean().optional().default(false),
});

// Schema for message ID parameter
export const messageIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});

// Type inference from Zod schemas (one of Zod's best features!)
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type MessageIdInput = z.infer<typeof messageIdSchema>;
