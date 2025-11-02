import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Loading from './components/UI/Loading';
import QuickMoodWidget from './components/Mood/QuickMoodWidget';

// Pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import MoodTracker from './pages/MoodTracker';
import Resources from './pages/Resources';
import Wellness from './pages/Wellness';
import Settings from './pages/Settings';
import Journal from './pages/Journal';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import EmergencyHelp from './pages/EmergencyHelp';
import EmergencyFAB from './components/UI/EmergencyFAB';
function App() {
  const { loading, preferences } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
        <Loading size="lg" text="Initializing MindMirror..." />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${
        preferences.theme === 'dark' ? 'dark' : ''
      } bg-gray-50 dark:bg-dark-bg text-gray-800 dark:text-dark-text transition-colors duration-300`}
    >
      <Header />

      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/emergency" element={<EmergencyHelp />} />
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Floating Mood Widget (only visible on large screens) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <QuickMoodWidget />
        <EmergencyFAB />
      </div>
    </div>
  );
}

/* ------------------------------
   Not Found Page (404)
------------------------------ */
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg text-center transition-colors duration-300">
      <div className="max-w-md p-8 bg-white dark:bg-dark-card rounded-2xl shadow-md border border-gray-200 dark:border-dark-border animate-fade-in">
        <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
          404
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Oops! The page you’re looking for doesn’t exist or was moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
        >
          Go Back Home
        </a>
      </div>
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        MindMirror © {new Date().getFullYear()} — Your wellness companion 💙
      </p>
    </div>
  );
};

export default App;
