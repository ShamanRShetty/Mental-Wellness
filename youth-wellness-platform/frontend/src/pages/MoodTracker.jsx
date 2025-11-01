import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { logMood, getMoodInsights } from '../services/api';
import MoodSelector from '../components/Mood/MoodSelector';
import MoodChart from '../components/Mood/MoodChart';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Loading from '../components/UI/Loading';
import Alert from '../components/UI/Alert';
import { Calendar, TrendingUp, Brain } from 'lucide-react';
import { getMoodEmoji, getMoodLabel, formatDate } from '../utils/helpers';

const MoodTracker = () => {
  const { moodLogs, addMood, sessionId, moodInsights, saveInsights } = useApp();
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [triggers, setTriggers] = useState('');
  const [activities, setActivities] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Restore from localStorage or context before render
  useEffect(() => {
    const storedLogs = localStorage.getItem('moodLogs');
    const storedInsights = localStorage.getItem('moodInsights');

    if (storedLogs) {
      setMoodHistory(JSON.parse(storedLogs));
    } else if (moodLogs?.length) {
      setMoodHistory(moodLogs);
    }

    if (storedInsights) {
      setInsights(JSON.parse(storedInsights));
    } else if (moodInsights) {
      setInsights(moodInsights);
    }

    setLoading(false);
  }, []); // only once on mount

  // ✅ Keep localStorage in sync with global context
  useEffect(() => {
    if (moodLogs?.length) {
      setMoodHistory(moodLogs);
      localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    }
  }, [moodLogs]);

  // ✅ Fetch insights when mood history changes
  useEffect(() => {
    const fetchInsights = async () => {
      if (!sessionId || !moodHistory.length) return;
      try {
        const res = await getMoodInsights(sessionId);
        if (res?.success && res.insights) {
          setInsights(res.insights);
          saveInsights(res.insights);
          localStorage.setItem('moodInsights', JSON.stringify(res.insights));
        }
      } catch (err) {
        console.warn('Could not load AI insights:', err);
      }
    };
    fetchInsights();
  }, [sessionId, moodHistory, saveInsights]);

  // ✅ Persist moods locally when they change
  useEffect(() => {
    if (moodHistory.length) {
      localStorage.setItem('moodLogs', JSON.stringify(moodHistory));
    }
  }, [moodHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      alert('Please select a mood before saving.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const newEntry = {
      id: Date.now(),
      sessionId,
      mood: selectedMood,
      intensity: Number(intensity),
      note: note.trim(),
      triggers: triggers
        ? triggers.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      activities: activities
        ? activities.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      timestamp: new Date().toISOString(),
    };

    try {
      await logMood(newEntry);
      addMood(newEntry);
      const updatedHistory = [newEntry, ...moodHistory];
      setMoodHistory(updatedHistory);
      localStorage.setItem('moodLogs', JSON.stringify(updatedHistory));

      setSuccess(true);
      setSelectedMood(null);
      setIntensity(5);
      setNote('');
      setTriggers('');
      setActivities('');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // ✅ Refresh insights after successful log
      try {
        const res = await getMoodInsights(sessionId);
        if (res?.success && res.insights) {
          setInsights(res.insights);
          saveInsights(res.insights);
          localStorage.setItem('moodInsights', JSON.stringify(res.insights));
        }
      } catch {
        /* ignore */
      }
    } catch (err) {
      console.error('Failed to log mood:', err);
      setError('Failed to save mood. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <Loading size="lg" text="Loading your mood data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Mood Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your emotional patterns and gain insights into your mental wellness journey
          </p>
        </div>

        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              message="Mood logged successfully! Keep tracking to see your patterns."
              onClose={() => setSuccess(false)}
            />
          </div>
        )}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                How are you feeling?
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select your mood
                  </label>
                  <MoodSelector
                    selectedMood={selectedMood}
                    onSelect={(mood) => {
                      setSelectedMood(mood);
                      setSuccess(false);
                      setError(null);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Intensity: {intensity}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Mild</span>
                    <span>Intense</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What's on your mind? (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write about your feelings..."
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Triggers (Optional)
                  </label>
                  <input
                    type="text"
                    value={triggers}
                    onChange={(e) => setTriggers(e.target.value)}
                    placeholder="e.g., exams, family, social media"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Separate multiple triggers with commas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Activities (Optional)
                  </label>
                  <input
                    type="text"
                    value={activities}
                    onChange={(e) => setActivities(e.target.value)}
                    placeholder="e.g., studied, talked to friend, exercised"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Separate multiple activities with commas
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedMood || submitting}
                  loading={submitting}
                >
                  Save Mood Entry
                </Button>
              </form>
            </Card>
          </div>

          {/* Right: Charts, Insights, Stats, Recent */}
          <div className="lg:col-span-2 space-y-6">
            {moodHistory.length > 0 && <MoodChart moodEntries={moodHistory} />}

            {/* Insights */}
            {moodHistory.length >= 3 && insights?.aiAnalysis && (
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="text-purple-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    AI Insights
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {insights.aiAnalysis}
                </p>
                {insights.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    {insights.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
                      >
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {rec.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Statistics */}
            {moodHistory.length >= 3 && insights?.statistics && (
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-green-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Your Statistics
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Total Entries
                    </p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {insights.statistics.totalEntries}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Most Common
                    </p>
                    <p className="text-2xl">
                      {getMoodEmoji(insights.statistics.mostCommonMood)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {getMoodLabel(insights.statistics.mostCommonMood)}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trend</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
                      {insights.statistics.trend}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Intensity</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {insights.statistics.averageIntensity}/10
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Entries */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-blue-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Recent Entries
                </h3>
              </div>

              {moodHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    No mood entries yet. Start tracking to see your patterns!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {moodHistory.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {getMoodLabel(entry.mood)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.timestamp ? formatDate(entry.timestamp) : 'Unknown'}
                          </p>
                          {entry.note && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {entry.note.length > 50
                                ? entry.note.substring(0, 50) + '...'
                                : entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Intensity</p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {entry.intensity ?? '-'}/10
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
