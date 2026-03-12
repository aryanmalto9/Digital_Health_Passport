import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import './AIChatPage.css';

const SUGGESTIONS = [
  "What are symptoms of diabetes?",
  "Explain what a CBC blood test measures",
  "What does hypertension mean?",
  "How do I read my cholesterol report?",
];

function AIChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI Health Assistant. I can help you understand medical terms, explain health reports, and answer general health questions.\n\n⚠️ I am not a doctor. My responses are for informational purposes only. Always consult a healthcare professional for medical advice.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/ai/chat', { message: msg, history });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.response?.data?.message || 'Sorry, I encountered an error. Please try again.'
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="chat-page fade-in">
      <div className="page-header">
        <h1>🤖 AI Health Assistant</h1>
        <p>Ask general health questions and understand medical terminology.</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <div className="message-avatar">{m.role === 'user' ? '👤' : '🤖'}</div>
              <div className="message-bubble">
                <pre className="message-text">{m.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="suggestions">
            <p className="suggestions-label">Try asking:</p>
            <div className="suggestion-chips">
              {SUGGESTIONS.map(s => (
                <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-bar">
          <textarea
            className="chat-input"
            placeholder="Ask a health question... (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="btn btn-primary send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            {loading ? <span className="spinner" /> : '➤'}
          </button>
        </div>
      </div>

      <div className="chat-disclaimer">
        ⚠️ This AI provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment.
      </div>
    </div>
  );
}

export default AIChatPage;
