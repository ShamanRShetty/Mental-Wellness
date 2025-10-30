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
      await resetSession();
      clearSessionId();
      setResetSuccess(true);
      setShowResetConfirm(false);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Failed to reset session:', error);
      alert('Failed to reset session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">
            Customize your MindCare experience
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
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <User className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Account</h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-blue-800">
                    Your session is completely anonymous. No personal information is stored.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Session ID: <code className="bg-blue-100 px-2 py-1 rounded">{preferences.sessionId || 'Not available'}</code>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Language Settings */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Language</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Choose your preferred language for the app
            </p>
            <div className="space-y-3">
              {[
                { code: 'en', name: 'English' },
                { code: 'hi', name: 'हिंदी (Hindi)' },
                { code: 'ta', name: 'தமிழ் (Tamil)' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-3 border-2 rounded-lg transition ${
                    preferences.language === lang.code
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{lang.name}</span>
                  {preferences.language === lang.code && (
                    <span className="ml-2 text-blue-600 text-sm">✓ Active</span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Note: Full multi-language support coming soon
            </p>
          </Card>

          {/* Theme Settings */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Moon className="text-purple-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Appearance</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Choose your preferred theme
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`px-4 py-3 border-2 rounded-lg transition ${
                  preferences.theme === 'light'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updatePreferences({ theme: 'light' })}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">☀️</div>
                  <span className="font-medium">Light</span>
                </div>
              </button>
              <button
                className={`px-4 py-3 border-2 rounded-lg transition ${
                  preferences.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updatePreferences({ theme: 'dark' })}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌙</div>
                  <span className="font-medium">Dark</span>
                </div>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Note: Dark mode coming soon
            </p>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="text-red-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Privacy & Data
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
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
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium mb-4">
                  Are you sure you want to reset all your data? This will:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 mb-4 space-y-1">
                  <li>Delete all chat history</li>
                  <li>Delete all mood entries</li>
                  <li>Create a new anonymous session</li>
                  <li>This action cannot be undone</li>
                </ul>
                <div className="flex gap-3">
                  <Button variant="danger" onClick={handleResetSession}>
                    Yes, Reset Everything
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* About */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              About MindCare
            </h2>
            <p className="text-gray-600 mb-4">
              MindCare is a mental wellness platform designed specifically for Indian youth, built with empathy and cultural awareness.
            </p>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Version: 1.0.0</p>
              <p>Built for: Google GenAI Hack2Skill Hackathon 2024</p>
              <p>
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                {' • '}
                <a href="/terms" className="text-blue-600 hover:underline">
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