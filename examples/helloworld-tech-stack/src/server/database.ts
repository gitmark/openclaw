import Database from 'better-sqlite3';
import type { Message } from '../shared/types.js';

/**
 * SQLite: Lightweight, serverless database engine
 *
 * SQLite is a self-contained database that stores data in a single file.
 * Unlike client-server databases (PostgreSQL, MySQL), SQLite runs in-process,
 * making it perfect for embedded applications, local development, and small apps.
 * OpenClaw uses the native Node.js SQLite module, but we use better-sqlite3
 * for this demo as it's easier to set up.
 */

// Create/open database file
const db = new Database('messages.db');

// Enable Write-Ahead Logging for better performance
db.pragma('journal_mode = WAL');

/**
 * Initialize database schema
 * Creates the messages table if it doesn't exist
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      ai_enhanced INTEGER NOT NULL DEFAULT 0,
      ai_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ SQLite database initialized');
}

/**
 * Create a new message in the database
 */
export function createMessage(
  content: string,
  aiResponse?: string
): Message {
  const stmt = db.prepare(`
    INSERT INTO messages (content, ai_enhanced, ai_response)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(content, aiResponse ? 1 : 0, aiResponse || null);

  return {
    id: result.lastInsertRowid as number,
    content,
    aiEnhanced: !!aiResponse,
    aiResponse,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Get all messages from the database
 */
export function getAllMessages(): Message[] {
  const stmt = db.prepare(`
    SELECT
      id,
      content,
      ai_enhanced as aiEnhanced,
      ai_response as aiResponse,
      created_at as createdAt
    FROM messages
    ORDER BY created_at DESC
    LIMIT 50
  `);

  return stmt.all() as Message[];
}

/**
 * Get a single message by ID
 */
export function getMessageById(id: number): Message | undefined {
  const stmt = db.prepare(`
    SELECT
      id,
      content,
      ai_enhanced as aiEnhanced,
      ai_response as aiResponse,
      created_at as createdAt
    FROM messages
    WHERE id = ?
  `);

  return stmt.get(id) as Message | undefined;
}

/**
 * Close database connection
 */
export function closeDatabase() {
  db.close();
}
