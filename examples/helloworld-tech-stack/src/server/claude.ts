import Anthropic from '@anthropic-ai/sdk';

/**
 * Anthropic Claude API: AI language model integration
 *
 * The Anthropic SDK provides access to Claude, a powerful AI assistant.
 * Claude can understand context, generate text, answer questions, and more.
 * This is the same AI technology that powers the OpenClaw gateway.
 */

// Initialize the Anthropic client with API key from environment
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Enhance a user message using Claude AI
 *
 * @param userMessage - The original message from the user
 * @returns Claude's enhanced/response to the message
 */
export async function enhanceWithClaude(
  userMessage: string
): Promise<string> {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return '[AI unavailable - no API key configured]';
    }

    // Call Claude API using the Messages API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Using Claude 3.5 Sonnet
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Respond to this message in a friendly, helpful way (keep it brief, 1-2 sentences): "${userMessage}"`,
        },
      ],
    });

    // Extract the text response from Claude's message
    const textContent = message.content.find((block) => block.type === 'text');
    return textContent?.type === 'text' ? textContent.text : '[No response]';
  } catch (error) {
    console.error('Claude API error:', error);
    return '[AI error - check API key and connection]';
  }
}
