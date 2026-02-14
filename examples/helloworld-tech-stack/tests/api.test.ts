import { describe, it, expect, beforeAll } from 'vitest';
import { createMessageSchema, messageIdSchema } from '../src/server/schemas.js';

/**
 * Vitest: Fast, modern unit testing framework
 *
 * Vitest is built on top of Vite and provides a Jest-compatible API
 * with much faster performance. It includes features like:
 * - Fast test execution with smart watch mode
 * - TypeScript support out of the box
 * - Jest-compatible API (describe, it, expect)
 * - Code coverage reporting
 * - Snapshot testing
 *
 * OpenClaw uses Vitest extensively for testing all components.
 */

describe('Zod Schema Validation', () => {
  /**
   * Test the createMessageSchema
   * This demonstrates how Zod validates data at runtime
   */
  describe('createMessageSchema', () => {
    it('should accept valid message data', () => {
      const validData = {
        content: 'Hello, World!',
        useAI: true,
      };

      const result = createMessageSchema.parse(validData);
      expect(result.content).toBe('Hello, World!');
      expect(result.useAI).toBe(true);
    });

    it('should reject empty content', () => {
      const invalidData = {
        content: '',
        useAI: false,
      };

      expect(() => createMessageSchema.parse(invalidData)).toThrow();
    });

    it('should reject content that is too long', () => {
      const invalidData = {
        content: 'a'.repeat(1001), // 1001 characters
        useAI: false,
      };

      expect(() => createMessageSchema.parse(invalidData)).toThrow();
    });

    it('should default useAI to false if not provided', () => {
      const data = {
        content: 'Test message',
      };

      const result = createMessageSchema.parse(data);
      expect(result.useAI).toBe(false);
    });
  });

  /**
   * Test the messageIdSchema
   * This demonstrates Zod's transform capabilities
   */
  describe('messageIdSchema', () => {
    it('should accept numeric string and transform to number', () => {
      const data = { id: '123' };
      const result = messageIdSchema.parse(data);
      expect(result.id).toBe(123);
      expect(typeof result.id).toBe('number');
    });

    it('should reject non-numeric strings', () => {
      const data = { id: 'abc' };
      expect(() => messageIdSchema.parse(data)).toThrow();
    });

    it('should reject negative numbers', () => {
      const data = { id: '-1' };
      // The regex only allows digits, so this should fail
      expect(() => messageIdSchema.parse(data)).toThrow();
    });
  });
});

/**
 * TypeScript type inference test
 * This demonstrates how TypeScript works with Zod
 */
describe('TypeScript Integration', () => {
  it('should infer correct types from Zod schemas', () => {
    const data = createMessageSchema.parse({
      content: 'Test',
      useAI: true,
    });

    // TypeScript knows these properties exist and their types
    // If you hover over 'data' in VS Code, you'll see the inferred type
    expect(typeof data.content).toBe('string');
    expect(typeof data.useAI).toBe('boolean');
  });
});

/**
 * Example of a simple utility test
 */
describe('Basic JavaScript/TypeScript features', () => {
  it('should demonstrate basic assertions', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
    expect([1, 2, 3]).toHaveLength(3);
  });

  it('should handle async operations', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
  });
});
