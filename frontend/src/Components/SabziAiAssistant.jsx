import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Input, Button, Spin } from "antd";
import {
  SendOutlined,
  CloseOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import api from "../Api/axiosInstance";

const quickPrompts = [
  "Aaj sab se sasti sabzi konsi hai?",
  "Weight loss ke liye konsi sabzi behtar hai?",
  "Protein wali sabziyan konsi hain?",
  "Aalo aur matar se kya recipe ban sakti hai?",
];

const SabziAiModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([
    {
      sender: "ai",
      text: "As-salamu alaykum! Main SabziMandi AI Assistant hoon. Mandi rates, sasti sabziyan, ya recipes ke baare mein kuch bhi poochein! 🥦",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, isOpen]);

  const handleAsk = async (queryText) => {
    const textToSend = queryText || question;
    if (!textToSend.trim() || loading) return;

    const userMessage = { sender: "user", text: textToSend };
    setConversation((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/ai/ask", { prompt: textToSend });
      if (res.data?.success) {
        setConversation((prev) => [
          ...prev,
          { sender: "ai", text: res.data.answer },
        ]);
      }
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Maaf kijiye, server se connect hone mein masla aa raha hai. Barah-e-karam dobara koshish karein.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        className={`floating-ai-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sabzi AI Assistant"
      >
        <span className="trigger-icon">{isOpen ? "✖" : "🥬"}</span>
        <span className="trigger-pulse" />
      </button>

      {/* Chatbox Window */}
      {isOpen && (
        <div className="ai-messenger-card">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="header-info">
              <span className="ai-avatar">🥬</span>
              <div>
                <h4>SabziMandi AI</h4>
                <p>Live Rates & Smart Recipes</p>
              </div>
            </div>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="ai-quick-tags no-scrollbar" >
            {quickPrompts.map((q, i) => (
              <button key={i} onClick={() => handleAsk(q)}>
                <BulbOutlined /> {q}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="ai-chat-body">
            {conversation.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble ai loading">
                <Spin size="small" /> <span>Answer in the way...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="ai-chat-footer">
            <Input
              value={question}
              placeholder="Ask about vegetable ..."
              onChange={(e) => setQuestion(e.target.value)}
              onPressEnter={() => handleAsk()}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleAsk()}
              loading={loading}
              style={{ backgroundColor: "#2e7d32" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SabziAiModal;