import { useState, useRef, useEffect } from "react";
import { useProfileSettings } from "@/hooks/useProfileSettings";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/portfolio-assistant`;

export function AIChatbot() {
  const { data: profileSettings } = useProfileSettings();
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const name = profileSettings?.hero_name || "Vikas";
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0] || "Vikas";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${firstName}'s AI Assistant. I can help you understand what kind of project you need, suggest the right technologies, and connect you with ${firstName} for your development needs. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /*
   * Replaced Supabase Edge Function with local backend API.
   * This is a simplified version that does NOT stream responses yet.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Use local API instead of Supabase Edge Function
      const apiUrl = import.meta.env.VITE_API_URL || 'https://vikasjagtap.up.railway.app/api';
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add auth token if needed: Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage = data.reply || "I'm not sure how to respond to that.";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I apologize, but I'm having trouble connecting to the backend. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-trigger"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span className="chatbot-pulse" />
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window animate-slide-up">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V4H8"></path>
                  <rect x="8" y="12" width="8" height="8" rx="1"></rect>
                  <path d="M16 12V4H12"></path>
                </svg>
              </div>
              <div>
                <h3 className="chatbot-title">{firstName}'s Assistant</h3>
                <span className="chatbot-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close"
              aria-label="Close chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`chat-avatar ${message.role === "assistant" ? "bot" : "user"}`}>
                  {message.role === "assistant" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8V4H8"></path>
                      <rect x="8" y="12" width="8" height="8" rx="1"></rect>
                      <path d="M16 12V4H12"></path>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <div className={`chat-bubble ${message.role === "assistant" ? "bot" : "user"}`}>
                  {message.content || <span className="chat-cursor"></span>}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="chat-message">
                <div className="chat-avatar bot">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8V4H8"></path>
                    <rect x="8" y="12" width="8" height="8" rx="1"></rect>
                    <path d="M16 12V4H12"></path>
                  </svg>
                </div>
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="chatbot-quick-actions">
              <button onClick={() => setInput("I need a website")}>
                🌐 I need a website
              </button>
              <button onClick={() => setInput(`Tell me about ${firstName}`)}>
                👨‍💻 About {firstName}
              </button>
              <button onClick={() => setInput("What technologies do you work with?")}>
                ⚡ Technologies
              </button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="chatbot-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="input chatbot-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
