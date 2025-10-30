import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendMessage, getConversationHistory } from '../services/api';
import Message from '../components/Chat/Message';
import CrisisAlert from '../components/Chat/CrisisAlert';
import Button from '../components/UI/Button';
import Loading from '../components/UI/Loading';

const Chat = () => {
  const { sessionId } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crisisAlert, setCrisisAlert] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history
  useEffect(() => {
    const loadHistory = async () => {
      if (!sessionId) return;
      try {
        const response = await getConversationHistory(sessionId);
        if (response.success && response.history) {
          setMessages(response.history);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadHistory();
  }, [sessionId]);

  // Handle send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessage(sessionId, userMessage.content);

      if (response.success) {
        const aiMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: response.timestamp,
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (response.crisis && response.crisis.detected) {
          setCrisisAlert(response.crisis);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');

      const fallbackMessage = {
        role: 'assistant',
        content:
          "I'm having trouble connecting right now, but I'm here for you. Could you try sending your message again?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const quickResponses = [
    "I'm feeling stressed about exams",
    "I feel lonely",
    "I'm worried about my future",
    "I need someone to talk to",
  ];

  const handleQuickResponse = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading your conversation..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-purple-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Your Safe Space
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">
              This is a judgment-free zone. Share what's on your mind, and I'll
              listen with empathy and understanding. Your conversation is completely anonymous.
            </p>

            {/* Quick Responses */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-500 mb-4">Try starting with:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-left text-gray-700"
                  >
                    {response}
                  </button>
                ))}
              </div>
              {/* Removed Start button from Chat */}
            </div>
          </div>
        )}

        {/* Crisis Alert */}
        {crisisAlert && (
          <CrisisAlert
            crisisData={crisisAlert}
            onClose={() => setCrisisAlert(null)}
          />
        )}

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Loader className="text-white animate-spin" size={20} />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <p className="text-gray-600">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            >
              <Send size={20} className="inline mr-2" />
              Send
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Your conversation is completely anonymous
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
