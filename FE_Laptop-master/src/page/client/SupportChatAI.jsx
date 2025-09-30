// Component con để render markdown AI với link sản phẩm đã xử lý
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../style/ChatBox.css";
const AIMarkdownMessage = ({ text }) => {
  const processedMarkdown = useProcessedMarkdown(text);
  return (
    <ReactMarkdown
      children={processedMarkdown}
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ node, ...props }) => <strong style={{ color: "#073fe3", fontWeight: "bold" }} {...props} />,
        em: ({ node, ...props }) => <em style={{ color: "#dc3545", fontStyle: "italic" }} {...props} />,
        h1: ({ node, ...props }) => (
          <h1
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#1976d2",
              margin: "10px 0",
            }}
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#1976d2",
              margin: "8px 0",
            }}
            {...props}
          />
        ),
        h3: ({ node, ...props }) => <h3 style={{ fontWeight: "bold", color: "#1976d2", margin: "6px 0" }} {...props} />,
        ul: ({ node, ...props }) => <ul style={{ marginLeft: 20, marginBottom: 8 }} {...props} />,
        li: ({ node, ...props }) => <li style={{ marginBottom: 4 }} {...props} />,
        p: ({ node, ...props }) => <p style={{ marginBottom: 8, lineHeight: 1.6 }} {...props} />,
        a: ({ node, ...props }) => <a style={{ color: "#e91e63", fontWeight: "bold" }} {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            style={{
              borderLeft: "4px solid #1976d2",
              paddingLeft: 10,
              color: "#666",
              fontStyle: "italic",
              margin: "8px 0",
            }}
            {...props}
          />
        ),
        code: ({ node, ...props }) => (
          <code
            style={{
              background: "#f5f5f5",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: "13px",
            }}
            {...props}
          />
        ),
      }}
    />
  );
};

// Custom hook to process markdown (remove all links, keep only text)
const useProcessedMarkdown = (markdown) => {
  // Remove markdown links [text](url) and keep only the text part
  return markdown.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
};

const SupportChatAI = ({ showChatBox, toggleChatBox }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customInput = null) => {
    const messageText = customInput || input;
    if (!messageText.trim()) return;

    const userMsg = { sender: "user", text: messageText };
    setMessages([...messages, userMsg]);
    setLoading(true);
    if (!customInput) setInput("");

    try {
      const res = await fetch("http://localhost:8081/api/ai-chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: messageText }),
      });

      let aiText = "";
      try {
        const data = await res.json();
        aiText = data?.answer || "Xin lỗi, tôi chưa có câu trả lời.";
      } catch {
        aiText = "Xin lỗi, tôi chưa có câu trả lời.";
      }

      if (!res.ok) {
        throw new Error(`Lỗi máy chủ (${res.status})`);
      }

      setMessages((msgs) => [...msgs, { sender: "ai", text: aiText }]);
    } catch (e) {
      const msg = e.message.includes("Failed to fetch")
        ? "Không thể kết nối tới máy chủ. Hãy kiểm tra server đang chạy và cấu hình CORS."
        : `Lỗi: ${e.message}`;
      setMessages((msgs) => [...msgs, { sender: "ai", text: msg }]);
    }
    setLoading(false);
  };

  const renderMessage = (msg) => {
    // For AI messages, render markdown only
    if (msg.sender === "ai") {
      return (
        <div>
          <AIMarkdownMessage text={msg.text} />
        </div>
      );
    }

    // For user messages, render plain text
    return <span>{msg.text}</span>;
  };

  return showChatBox ? (
    <div className="chat-box-container show">
      <div className="chat-box">
        <div className="chat-header">
          <span>Chat với AI</span>
          <button onClick={toggleChatBox} className="close-button">
            ×
          </button>
        </div>
        <div className="chat-intro">
          <p>Bạn đang trò chuyện với AI tư vấn laptop. Hãy nhập câu hỏi về nhu cầu, giá, sản phẩm phù hợp!</p>
        </div>
        <div className="chat-content">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-container ${msg.sender}`}>
              <div className={`message-bubble ${msg.sender}`}>
                <strong>{msg.sender === "user" ? "Bạn" : "AI"}:</strong> {renderMessage(msg)}
              </div>
            </div>
          ))}
          {loading && <div className="loading-message">AI: Đang trả lời...</div>}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Nhập câu hỏi..."
            aria-label="Nhập câu hỏi để trò chuyện với AI"
          />
          <button onClick={sendMessage} disabled={loading} aria-label="Gửi tin nhắn">
            Gửi
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SupportChatAI;
