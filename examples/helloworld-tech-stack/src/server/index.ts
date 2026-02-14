import express from 'express';
import { initDatabase, createMessage, getAllMessages, getMessageById, closeDatabase } from './database.js';
import { createMessageSchema, messageIdSchema } from './schemas.js';
import { enhanceWithClaude } from './claude.js';

/**
 * Express: Minimal and flexible Node.js web application framework
 *
 * Express is the most popular web framework for Node.js. It provides
 * a robust set of features for building web applications and APIs,
 * including routing, middleware, and HTTP utilities.
 */

// Create Express application instance
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize database on startup
initDatabase();

/**
 * API Routes
 */

// GET /api/messages - Fetch all messages
app.get('/api/messages', (req, res) => {
  try {
    const messages = getAllMessages();
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// GET /api/messages/:id - Fetch a specific message
app.get('/api/messages/:id', (req, res) => {
  try {
    // Validate the ID parameter using Zod
    const { id } = messageIdSchema.parse({ id: req.params.id });

    const message = getMessageById(id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid message ID' });
  }
});

// POST /api/messages - Create a new message
app.post('/api/messages', async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = createMessageSchema.parse(req.body);

    let aiResponse: string | undefined;

    // If AI enhancement is requested, call Claude API
    if (validatedData.useAI) {
      aiResponse = await enhanceWithClaude(validatedData.content);
    }

    // Save to SQLite database
    const message = createMessage(validatedData.content, aiResponse);

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    // Zod validation errors
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error,
      });
    }

    res.status(500).json({ success: false, error: 'Failed to create message' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    technologies: {
      runtime: 'Node.js',
      language: 'TypeScript',
      framework: 'Express',
      database: 'SQLite',
      validation: 'Zod',
      ai: 'Anthropic Claude',
    },
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - GET    /api/health`);
  console.log(`   - GET    /api/messages`);
  console.log(`   - GET    /api/messages/:id`);
  console.log(`   - POST   /api/messages`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
});
