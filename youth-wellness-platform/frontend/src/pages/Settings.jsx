import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { clearSessionId } from '../utils/storage';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import { User, Globe, Moon, Trash2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { preferences, updatePreferences, resetSession } = useApp();
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLanguageChange = (language) => {
    updatePreferences({ language });
  };

  const handleResetSession = async () => {
  try {
    // Confirm reset action
    if (!window.confirm("Are you sure you want to reset all your data? This cannot be undone.")) {
      return;
    }

    // 🧹 Clear localStorage (all app data)
    localStorage.removeItem('moodLogs');
    localStorage.removeItem('moodInsights');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('preferences');

    // Optionally: clear everything
    // localStorage.clear();

    // 🧠 Reset app session
    await resetSession();
    clearSessionId();

    // ✅ Show success + redirect
    setResetSuccess(true);
    setShowResetConfirm(false);

    // Small delay to show alert before redirect
    setTimeout(() => {
      window.location.reload(); // ensures full reset
      navigate('/');
    }, 1500);
  } catch (error) {
    console.error('Failed to reset session:', error);
    alert('Failed to reset session. Please try again.');
  }
};


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your MindMirror experience
          </p>
        </div>

        {resetSuccess && (
          <div className="mb-6">
            <Alert
              type="success"
              message="Session reset successfully! Redirecting to home..."
            />
          </div>
        )}

        <div className="space-y-6">
          {/* Account Section */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-blue-600 dark:text-blue-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Account
              </h2>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your session is completely anonymous. No personal information is stored.
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                    Session ID:{' '}
                    <code className="bg-blue-100 dark:bg-blue-950/60 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                      {preferences.sessionId || 'Not available'}
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </Card>
          {/* Theme Settings */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="text-purple-600 dark:text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Appearance
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Choose your preferred theme
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`px-4 py-3 border-2 rounded-lg transition-colors ${
                  preferences.theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => updatePreferences({ theme: 'light' })}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">☀️</div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Light</span>
                  {preferences.theme === 'light' && (
                    <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Active</div>
                  )}
                </div>
              </button>
              <button
                className={`px-4 py-3 border-2 rounded-lg transition-colors ${
                  preferences.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => updatePreferences({ theme: 'dark' })}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌙</div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Dark</span>
                  {preferences.theme === 'dark' && (
                    <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Active</div>
                  )}
                </div>
              </button>
            </div>
          </Card>

          {/* Privacy & Data */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="text-red-600 dark:text-red-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Privacy & Data
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your conversation data and start fresh
            </p>

            {!showResetConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowResetConfirm(true)}
                icon={<Trash2 size={18} />}
              >
                Reset All Data
              </Button>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-300 font-medium mb-4">
                  Are you sure you want to reset all your data? This will:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 mb-4 space-y-1">
                  <li>Delete all chat history</li>
                  <li>Delete all mood entries</li>
                  <li>Create a new anonymous session</li>
                  <li>This action cannot be undone</li>
                </ul>
                <div className="flex gap-3">
                  <Button variant="danger" onClick={handleResetSession}>
                    Yes, Reset Everything
                  </Button>
                  <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* About */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              About MindMirror
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              MindMirror is a mental wellness platform designed specifically for Indian youth, built with empathy and cultural awareness.
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>Version: 1.0.0</p>
              <p>Built for: Google GenAI Hack2Skill Hackathon 2024</p>
              <p>
                <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </a>
                {' • '}
                <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms of Service
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
