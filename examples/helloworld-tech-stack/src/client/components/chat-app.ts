import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { Message } from '../../shared/types.js';

/**
 * Lit: Modern web components library
 *
 * Lit is a lightweight library for building fast, reusable web components.
 * It uses modern web standards (Custom Elements, Shadow DOM) and provides
 * a declarative template system. OpenClaw uses Lit extensively for its UI.
 *
 * Key concepts:
 * - @customElement: Registers the component as a custom HTML element
 * - @state: Reactive property that triggers re-renders when changed
 * - html``: Tagged template for defining component templates
 * - css``: Tagged template for component-scoped styles
 */

@customElement('chat-app')
export class ChatApp extends LitElement {
  // Reactive state properties - changes trigger re-renders
  @state() messages: Message[] = [];
  @state() messageInput = '';
  @state() useAI = false;
  @state() loading = false;
  @state() error = '';

  // Component-scoped styles (Shadow DOM keeps these isolated)
  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: system-ui, -apple-system, sans-serif;
    }

    h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .tech-stack {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .form-container {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .input-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    input[type='text'] {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    }

    button:hover {
      background: #0056b3;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .error {
      color: #d32f2f;
      padding: 0.75rem;
      background: #ffebee;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      color: #666;
    }

    .ai-badge {
      background: #4caf50;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .message-content {
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .ai-response {
      background: #e3f2fd;
      padding: 0.75rem;
      border-radius: 4px;
      border-left: 3px solid #2196f3;
      margin-top: 0.5rem;
    }

    .ai-response-label {
      font-weight: 600;
      color: #1976d2;
      margin-bottom: 0.25rem;
    }
  `;

  // Lifecycle: Called when component is added to the DOM
  connectedCallback() {
    super.connectedCallback();
    this.loadMessages();
  }

  // Fetch all messages from the API
  async loadMessages() {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      if (data.success) {
        this.messages = data.data;
      }
    } catch (err) {
      this.error = 'Failed to load messages';
    }
  }

  // Handle form submission
  async handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.messageInput.trim()) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: this.messageInput,
          useAI: this.useAI,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add new message to the top of the list
        this.messages = [data.data, ...this.messages];
        this.messageInput = ''; // Clear input
      } else {
        this.error = data.error || 'Failed to send message';
      }
    } catch (err) {
      this.error = 'Network error - is the server running?';
    } finally {
      this.loading = false;
    }
  }

  // Render the component template
  render() {
    return html`
      <h1>🌟 OpenClaw Tech Stack Demo</h1>
      <p class="tech-stack">
        Node.js • TypeScript • Vite • Lit • Express • SQLite • Vitest • Zod •
        Claude AI
      </p>

      ${this.error ? html`<div class="error">${this.error}</div>` : ''}

      <div class="form-container">
        <form @submit=${this.handleSubmit}>
          <div class="input-group">
            <input
              type="text"
              .value=${this.messageInput}
              @input=${(e: Event) =>
                (this.messageInput = (e.target as HTMLInputElement).value)}
              placeholder="Type a message..."
              ?disabled=${this.loading}
            />
            <button type="submit" ?disabled=${this.loading}>
              ${this.loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          <div class="checkbox-group">
            <input
              type="checkbox"
              id="use-ai"
              .checked=${this.useAI}
              @change=${(e: Event) =>
                (this.useAI = (e.target as HTMLInputElement).checked)}
            />
            <label for="use-ai">✨ Enhance with Claude AI</label>
          </div>
        </form>
      </div>

      <div class="messages-list">
        ${this.messages.length === 0
          ? html`<p style="text-align: center; color: #999;">
              No messages yet. Send one above!
            </p>`
          : this.messages.map(
              (msg) => html`
                <div class="message-card">
                  <div class="message-header">
                    <span>${new Date(msg.createdAt).toLocaleString()}</span>
                    ${msg.aiEnhanced
                      ? html`<span class="ai-badge">AI Enhanced</span>`
                      : ''}
                  </div>
                  <div class="message-content">${msg.content}</div>
                  ${msg.aiResponse
                    ? html`
                        <div class="ai-response">
                          <div class="ai-response-label">Claude's Response:</div>
                          ${msg.aiResponse}
                        </div>
                      `
                    : ''}
                </div>
              `
            )}
      </div>
    `;
  }
}

// TypeScript: Export the component type for use in other files
declare global {
  interface HTMLElementTagNameMap {
    'chat-app': ChatApp;
  }
}
