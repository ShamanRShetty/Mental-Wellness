import React, { useState } from 'react';
import { Smile, X } from 'lucide-react';
import { logMood } from '../../services/api';
import { useApp } from '../../context/AppContext';

const QuickMoodWidget = () => {
  const { sessionId, addMood } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');

  const moods = [
    { value: 'very_sad', label: 'Very Sad', emoji: '😢' },
    { value: 'sad', label: 'Sad', emoji: '😔' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'happy', label: 'Happy', emoji: '🙂' },
    { value: 'very_happy', label: 'Very Happy', emoji: '😊' },
  ];

  const handleMoodSelect = async (mood) => {
    const moodKey = `quickMood_${sessionId}`;
    const hasLoggedMood = localStorage.getItem(moodKey);

    if (hasLoggedMood) {
      setLimitMessage("You’ve already logged your mood for this session 😊");
      setTimeout(() => setLimitMessage(''), 3000);
      return;
    }

    setSelectedMood(mood);
    setSaving(true);

    const newEntry = {
      id: Date.now(),
      sessionId,
      mood,
      intensity: 5,
      note: 'Quick check-in',
      triggers: [],
      activities: [],
      timestamp: new Date().toISOString(),
    };

    try {
      await logMood(newEntry);
      addMood(newEntry); // ✅ update global context
      localStorage.setItem(moodKey, 'true');

      // ✅ notify MoodTracker to refresh (if open)
      window.dispatchEvent(new Event('moodLogged'));

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
        setSelectedMood(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to log mood:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        aria-label="Quick mood check-in"
      >
        {isOpen ? <X className="text-white" size={28} /> : <Smile className="text-white" size={28} />}
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-80 z-50 animate-fade-in border border-gray-100 dark:border-gray-700">
          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Mood Logged!</h3>
              <p className="text-gray-600 dark:text-gray-400">Keep tracking to see your patterns</p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quick Check-in</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">How are you feeling right now?</p>

              {limitMessage ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 p-3 rounded-lg text-sm mb-3 border border-yellow-200 dark:border-yellow-800">
                  {limitMessage}
                </div>
              ) : (
                <div className="space-y-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      disabled={saving}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                        selectedMood === mood.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">{mood.label}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="/mood"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  View full mood tracker →
                </a>
              </div>
            </>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 dark:bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default QuickMoodWidget;
