import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { logMood, getMoodHistory, getMoodInsights } from '../services/api';
import MoodSelector from '../components/Mood/MoodSelector';
import MoodChart from '../components/Mood/MoodChart';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Loading from '../components/UI/Loading';
import Alert from '../components/UI/Alert';
import { Calendar, TrendingUp, Brain } from 'lucide-react';
import { getMoodEmoji, getMoodLabel, formatDate } from '../utils/helpers';

/**
 * MoodTracker (updated)
 * - Normalizes timestamps (timestamp | date | createdAt)
 * - Sorts mood entries newest-first
 * - Shows insights only after >= 3 entries
 * - Updates recent entries immediately after a successful log (prepends new entry)
 * - Defensive checks for missing sessionId / API shapes
 */

const MoodTracker = () => {
  const { sessionId } = useApp();
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [triggers, setTriggers] = useState('');
  const [activities, setActivities] = useState('');
  const [moodHistory, setMoodHistory] = useState([]); // newest-first
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Load mood history & insights when sessionId becomes available
  useEffect(() => {
    if (!sessionId) return;
    loadMoodData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Helper: normalize a single entry to have .timestamp field
  const normalizeEntry = (e) => {
    if (!e) return null;
    const timestamp = e.timestamp || e.date || e.createdAt || e.created_at || null;
    return { ...e, timestamp };
  };

  const loadMoodData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!sessionId) {
        setError('Session not available. Please refresh.');
        setLoading(false);
        return;
      }

      // Fetch history and insights in parallel (insights may be null if not enough entries)
      const [historyResponse, insightsResponse] = await Promise.allSettled([
        getMoodHistory(sessionId, 30),
        getMoodInsights(sessionId)
      ]);

      // Handle history
      if (historyResponse.status === 'fulfilled') {
        const historyData = historyResponse.value;
        if (historyData && historyData.success) {
          let entries = Array.isArray(historyData.moodEntries) ? historyData.moodEntries : [];
          // Normalize timestamps and filter out entries without timestamp
          entries = entries
            .map(normalizeEntry)
            .filter((e) => e && e.timestamp)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // newest-first

          setMoodHistory(entries);
        } else {
          // Backend returned success: false or different shape
          setMoodHistory([]);
        }
      } else {
        console.error('Failed to fetch mood history:', historyResponse.reason);
        setError('Failed to load mood history.');
      }

      // Handle insights: only use insights if backend provided them
      if (insightsResponse.status === 'fulfilled') {
        const insightsData = insightsResponse.value;
        // The backend returns { success: true, insights } or message if not enough data
        if (insightsData && insightsData.success && insightsData.insights) {
          setInsights(insightsData.insights);
        } else {
          setInsights(null);
        }
      } else {
        console.warn('Failed to fetch insights (non-fatal):', insightsResponse.reason);
        setInsights(null);
      }
    } catch (err) {
      console.error('loadMoodData error:', err);
      setError('An unexpected error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMood) {
      alert('Please select a mood before saving.');
      return;
    }

    if (!sessionId) {
      setError('Session not available. Try refreshing the page.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const moodData = {
        sessionId,
        mood: selectedMood,
        intensity: Number(intensity) || 5,
        note: note.trim(),
        triggers: triggers.trim() ? triggers.split(',').map((t) => t.trim()).filter(Boolean) : [],
        activities: activities.trim() ? activities.split(',').map((a) => a.trim()).filter(Boolean) : []
      };

      const response = await logMood(moodData);

      if (response && response.success) {
        setSuccess(true);
        setError(null);

        // New entry returned by backend? Use it; otherwise build one from the payload
        const returnedEntry = response.moodEntry || {
          mood: moodData.mood,
          intensity: moodData.intensity,
          note: moodData.note,
          activities: moodData.activities,
          triggers: moodData.triggers,
          timestamp: new Date().toISOString()
        };

        const normalized = normalizeEntry(returnedEntry);

        // Prepend new entry so recent entries update immediately (newest-first)
        setMoodHistory((prev) => {
          const newList = [normalized, ...prev].filter(Boolean);
          // Limit to some reasonable length to avoid growing too big (optional)
          return newList.slice(0, 200);
        });

        // If backend returned insights or totalEntries, update insights by re-fetching insights only
        // (insights are heavier — we fetch only insights here to refresh if available)
        try {
          const insightsResp = await getMoodInsights(sessionId);
          if (insightsResp && insightsResp.success && insightsResp.insights) {
            setInsights(insightsResp.insights);
          } else {
            // if not enough data yet, keep whatever we have or null
            setInsights((prev) => prev); // no-op
          }
        } catch (err) {
          // non-fatal
          console.warn('Could not refresh insights:', err);
        }

        // Reset form
        setSelectedMood(null);
        setIntensity(5);
        setNote('');
        setTriggers('');
        setActivities('');

        // Scroll to top / show success
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const message = (response && (response.message || response.error)) || 'Failed to save mood.';
        setError(message);
        setSuccess(false);
      }
    } catch (err) {
      console.error('Failed to log mood:', err);
      setError(err?.response?.data?.error || err?.message || 'Server error while saving mood.');
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  // If initial loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading your mood data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mood Tracker</h1>
          <p className="text-gray-600">
            Track your emotional patterns and gain insights into your mental wellness journey
          </p>
        </div>

        {/* Alerts */}
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
          {/* Left: form */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">How are you feeling?</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intensity: {intensity}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Mild</span>
                    <span>Intense</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind? (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write about your feelings..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Triggers (Optional)
                  </label>
                  <input
                    type="text"
                    value={triggers}
                    onChange={(e) => setTriggers(e.target.value)}
                    placeholder="e.g., exams, family, social media"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple triggers with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activities (Optional)
                  </label>
                  <input
                    type="text"
                    value={activities}
                    onChange={(e) => setActivities(e.target.value)}
                    placeholder="e.g., studied, talked to friend, exercised"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple activities with commas</p>
                </div>

                <Button type="submit" className="w-full" disabled={!selectedMood || submitting} loading={submitting}>
                  Save Mood Entry
                </Button>
              </form>
            </Card>
          </div>

          {/* Right: chart, insights, stats, recent */}
          <div className="lg:col-span-2 space-y-6">
            {moodHistory.length > 0 && <MoodChart moodEntries={moodHistory} />}

            {/* Insights: show only when >= 3 entries and insights exist */}
            {moodHistory.length >= 3 && insights && insights.aiAnalysis && (
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="text-purple-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">AI Insights</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{insights.aiAnalysis}</p>
                {insights.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    {insights.recommendations.map((rec, i) => (
                      <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">{rec.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Statistics: show only when >= 3 entries and statistics exist */}
            {moodHistory.length >= 3 && insights?.statistics && (
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-green-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">Your Statistics</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {insights.statistics.totalEntries}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Most Common</p>
                    <p className="text-2xl">{getMoodEmoji(insights.statistics.mostCommonMood)}</p>
                    <p className="text-xs text-gray-600">{getMoodLabel(insights.statistics.mostCommonMood)}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Trend</p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">{insights.statistics.trend}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Avg Intensity</p>
                    <p className="text-2xl font-bold text-gray-800">{insights.statistics.averageIntensity}/10</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Entries */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-blue-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">Recent Entries</h3>
              </div>

              {moodHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No mood entries yet. Start tracking to see your patterns!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {moodHistory.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <p className="font-medium text-gray-800">{getMoodLabel(entry.mood)}</p>
                          <p className="text-sm text-gray-600">{entry.timestamp ? formatDate(entry.timestamp) : 'Unknown'}</p>
                          {entry.note && (
                            <p className="text-sm text-gray-500 mt-1">
                              {entry.note.length > 50 ? entry.note.substring(0, 50) + '...' : entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Intensity</p>
                        <p className="text-xl font-bold text-blue-600">{entry.intensity ?? '-'}/10</p>
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
