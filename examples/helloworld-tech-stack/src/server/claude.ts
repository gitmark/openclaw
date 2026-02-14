import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic Claude API: AI language model integration
 *
 * The Anthropic SDK provides access to Claude, a powerful AI assistant.
 * Claude can understand context, generate text, answer questions, and more.
 * This is the same AI technology that powers the OpenClaw gateway.
 */

// Initialize the Anthropic client with API key from environment
// Note: Unused in mock mode, but kept for easy switching to real API
const _anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Enhance a user message using Claude AI
 *
 * 🎭 MOCK MODE: Returns simulated responses without calling the API
 * This lets you explore the OpenClaw stack without an API key!
 *
 * @param userMessage - The original message from the user
 * @returns Claude's enhanced/response to the message
 */
export async function enhanceWithClaude(userMessage: string): Promise<string> {
  // 🎭 MOCK MODE: Simulate API delay for realism
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

  // Generate varied mock responses based on message content
  const lowerMsg = userMessage.toLowerCase();

  // Fun, contextual mock responses
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
    const greetings = [
      "Hey there! 👋 I'm a mock Claude response - the real me would be even more helpful!",
      "Hello! This is a simulated response so you can test the app without an API key. Pretty cool, right?",
      "Hi! I'm running in demo mode right now, but you get the idea of how this works!",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (lowerMsg.includes("how") || lowerMsg.includes("what") || lowerMsg.includes("?")) {
    const responses = [
      "Great question! In mock mode, I give varied responses to show how the OpenClaw stack works. The real Claude API would give much more thoughtful answers!",
      "That's an interesting query! This demo shows the message flow from React → Express → 'Claude' → SQLite → back to you.",
      "Mock Claude here! The real version would analyze your question deeply, but I'm just here to demonstrate the architecture. 🏗️",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (lowerMsg.includes("test") || lowerMsg.includes("demo")) {
    return "Perfect! You're testing the OpenClaw stack. Notice how your message went from the frontend, through Express, to this 'AI' function, got saved in SQLite, and returned to you!";
  }

  // Default varied responses
  const defaultResponses = [
    "Thanks for your message! This mock response shows the full stack in action: TypeScript + React + Express + SQLite + (simulated) Claude API. 🚀",
    "Interesting! In production, Claude would give a thoughtful response here. For now, I'm just demonstrating the data flow through the OpenClaw stack.",
    "Got it! You can see how the UI updates, the message persists in SQLite, and the 'AI' response appears - all working together!",
    "Cool message! Notice the architecture: your input → validation (Zod) → AI enhancement (mocked) → database (SQLite) → React UI. That's the OpenClaw stack!",
    "Thanks! This demonstrates the complete flow without burning API credits. When you're ready, just add a real API key to get actual Claude responses. 💡",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
