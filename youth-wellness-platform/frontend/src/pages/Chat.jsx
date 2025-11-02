import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, AlertCircle, Globe } from 'lucide-react'; // 🌍 Added Globe icon
import { useApp } from '../context/AppContext';
import { sendMessage, getConversationHistory } from '../services/api';
import Message from '../components/Chat/Message';
import CrisisAlert from '../components/Chat/CrisisAlert';
import Button from '../components/UI/Button';
import Loading from '../components/UI/Loading';
import VoiceInput from '../components/Chat/VoiceInput';
import 'regenerator-runtime/runtime';

const Chat = () => {
  const { sessionId } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crisisAlert, setCrisisAlert] = useState(null);
  const [detectedLanguages, setDetectedLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('en'); // ✅ Added
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!sessionId) return;
      try {
        const response = await getConversationHistory(sessionId);
        if (response.success && response.history) setMessages(response.history);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadHistory();
  }, [sessionId]);

  const handleVoiceTranscript = (transcript) => setInput(transcript);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessage(sessionId, userMessage.content);
      if (response.success) {
        const aiMessage = {
  role: 'assistant',
  content: typeof response.message === 'object'
    ? response.message.message
    : response.message,
  language: response.message?.language || 'en',
  timestamp: response.timestamp,
};

        setMessages((prev) => [...prev, aiMessage]);

        if (response.detectedLanguage) {
          setDetectedLanguages((prev) => {
            const newLangs = [...prev, response.detectedLanguage];
            return newLangs.slice(-5);
          });
        }

        if (response.crisis && response.crisis.detected) setCrisisAlert(response.crisis);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting right now, but I'm here for you. Could you try sending your message again?",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // ✅ Multi-language quick responses
  const quickResponses = [
    {
      en: "I'm feeling stressed about exams",
      hi: "मुझे परीक्षाओं को लेकर तनाव है",
      ta: "தேர்வுகளைப் பற்றி நான் மன அழுத்தத்தில் இருக்கிறேன்",
      kn: "ಪರೀಕ್ಷೆಗಳ ಬಗ್ಗೆ ನನಗೆ ಒತ್ತಡವಾಗಿದೆ",
      ml: "പരീക്ഷകളെ കുറിച്ച് എനിക്ക് സമ്മർദ്ദം അനുഭവപ്പെടുന്നു",
      te: "పరీక్షల గురించి నాకు ఒత్తిడి గా అనిపిస్తోంది"
    },
    {
      en: "I feel lonely",
      hi: "मैं अकेला महसूस करता हूं",
      ta: "நான் தனிமையாக உணர்கிறேன்",
      kn: "ನಾನು ಒಂಟಿಯಾಗಿರುವಂತೆ ಭಾಸವಾಗುತ್ತದೆ",
      ml: "എനിക്ക് ഏകാകിയായി തോന്നുന്നു",
      te: "నాకు ఒంటరిగా అనిపిస్తోంది"
    },
    {
      en: "I'm worried about my future",
      hi: "मुझे अपने भविष्य की चिंता है",
      ta: "எனது எதிர்காலத்தைப் பற்றி நான் கவலைப்படுகிறேன்",
      kn: "ನನ್ನ ಭವಿಷ್ಯದ ಬಗ್ಗೆ ನನಗೆ ಚಿಂತೆಯಾಗಿದೆ",
      ml: "എനിക്ക് എന്റെ ഭാവിയെ കുറിച്ച് ആശങ്കയുണ്ട്",
      te: "నా భవిష్యత్తు గురించి నాకు ఆందోళనగా ఉంది"
    },
  ];

  const handleQuickResponse = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Loading size="lg" text="Loading your conversation..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {/* Language Indicator */}
        {detectedLanguages.length > 0 && (
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-full">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                🌐 Multi-language chat active • Speak or type in any language
              </span>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-purple-600 dark:text-purple-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Welcome to Your Safe Space
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
              This is a judgment-free zone. Share what's on your mind in <strong>English, Hindi, Tamil, Telugu, Kannada or Malayalam</strong>.
              I'll respond in the same language. Your conversation is completely anonymous.
            </p>

            {/* Quick Responses */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try starting with:</p>
              <div className="space-y-3">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response[selectedLang])} // ✅ Use selected language
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition text-sm"
                  >
                    {response[selectedLang] || response.en}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Crisis Alert */}
        {crisisAlert && (
          <CrisisAlert crisisData={crisisAlert} onClose={() => setCrisisAlert(null)} />
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
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Input Area */}
<div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg transition-colors duration-300">
  <div className="container mx-auto px-4 py-4 max-w-4xl">
    <form onSubmit={handleSend} className="flex gap-3 items-end flex-wrap sm:flex-nowrap">

      {/* 🎤 Voice Input */}
      <div className="flex items-center gap-2">
        <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />

        {/* 🌍 Language Dropdown (Moved Here) */}
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1">
          <Globe size={16} className="text-blue-500" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="kn">Kannada</option>
            <option value="ml">Malayalam</option>
          </select>
        </div>
      </div>

      {/* ✏️ Text Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Type in ${selectedLang === 'en' ? 'English' :
          selectedLang === 'hi' ? 'Hindi' :
          selectedLang === 'ta' ? 'Tamil' :
          selectedLang === 'te' ? 'Telugu' :
          selectedLang === 'kn' ? 'Kannada' : 'Malayalam'}...`}
        className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition"
        disabled={loading}
      />

      {/* 🚀 Send Button */}
      <Button type="submit" disabled={!input.trim() || loading} icon={<Send size={20} />}>
        Send
      </Button>
    </form>

    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
      🎤 Speak or type in any supported language • Your chat is private and safe
    </p>
  </div>
</div>

    </div>
  );
};

export default Chat;
