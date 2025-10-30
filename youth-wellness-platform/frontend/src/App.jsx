import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Loading from './components/UI/Loading';
import { initializeSession } from './services/api';

// Pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import MoodTracker from './pages/MoodTracker';
import Resources from './pages/Resources';
import Settings from './pages/Settings';

function App() {
  const { loading } = useApp();

  // ✅ Initialize session on first app load
  useEffect(() => {
    async function setupSession() {
      try {
        const data = await initializeSession();
        localStorage.setItem('sessionId', data.sessionId);
        console.log('✅ Session initialized:', data.sessionId);
      } catch (error) {
        console.error('❌ Failed to initialize session:', error);
      }
    }

    // Only create session if one doesn’t exist
    const existingSession = localStorage.getItem('sessionId');
    if (!existingSession) {
      setupSession();
    } else {
      console.log('🔁 Existing session found:', existingSession);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Initializing MindCare..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/settings" element={<Settings />} />
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// 404 Not Found Component
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>

        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default App;
