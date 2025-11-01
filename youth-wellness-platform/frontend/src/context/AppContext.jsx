import { createContext, useContext, useState, useEffect } from 'react';
import { initializeSession } from '../services/api';
import {
  getSessionId,
  saveSessionId,
  clearSessionId,
  getPreferences,
  savePreferences
} from '../utils/storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(getPreferences());
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisData, setCrisisData] = useState(null);

  // ✅ Persistent mood data
  const [moodLogs, setMoodLogs] = useState([]);
  const [moodInsights, setMoodInsights] = useState(null);

  // ✅ Apply theme immediately on mount
  useEffect(() => {
    const currentTheme = preferences?.theme || 'light';
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);

  // ✅ Reapply theme when preference changes
  useEffect(() => {
    if (preferences?.theme) {
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
    }
  }, [preferences.theme]);

  // ✅ Initialize or restore session
  useEffect(() => {
    const initSession = async () => {
      try {
        const existingSession = getSessionId();
        if (existingSession) {
          setSessionId(existingSession);
        } else {
          const response = await initializeSession(preferences.language);
          setSessionId(response.sessionId);
          saveSessionId(response.sessionId);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  // ✅ Load persisted mood data (just like Chat history)
  useEffect(() => {
    try {
      const storedMoods = localStorage.getItem('moodLogs');
      const storedInsights = localStorage.getItem('moodInsights');
      if (storedMoods) setMoodLogs(JSON.parse(storedMoods));
      if (storedInsights) setMoodInsights(JSON.parse(storedInsights));
    } catch (err) {
      console.warn('Error loading mood data from localStorage:', err);
    }
  }, []);

  // ✅ Persist mood data automatically
  useEffect(() => {
    if (moodLogs.length > 0) {
      localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    }
  }, [moodLogs]);

  useEffect(() => {
    if (moodInsights) {
      localStorage.setItem('moodInsights', JSON.stringify(moodInsights));
    }
  }, [moodInsights]);

  // ✅ Add mood (persists automatically)
  const addMood = (entry) => {
    const updated = [entry, ...moodLogs];
    setMoodLogs(updated);
    localStorage.setItem('moodLogs', JSON.stringify(updated));
  };

  // ✅ Save or update AI insights
  const saveInsights = (newInsights) => {
    setMoodInsights(newInsights);
    localStorage.setItem('moodInsights', JSON.stringify(newInsights));
  };

  // ✅ Reset session (keeps data intact)
  const resetSession = async () => {
    try {
      clearSessionId();
      const response = await initializeSession(preferences.language);
      setSessionId(response.sessionId);
      saveSessionId(response.sessionId);
      return response.sessionId;
    } catch (error) {
      console.error('Failed to reset session:', error);
      throw error;
    }
  };

  const updatePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    savePreferences(updated);
  };

  // Crisis modal handlers
  const triggerCrisisModal = (data) => {
    setCrisisData(data);
    setShowCrisisModal(true);
  };

  const closeCrisisModal = () => {
    setShowCrisisModal(false);
    setCrisisData(null);
  };

  const value = {
    sessionId,
    loading,
    preferences,
    updatePreferences,
    resetSession,
    showCrisisModal,
    crisisData,
    triggerCrisisModal,
    closeCrisisModal,
    moodLogs,
    addMood,
    moodInsights,
    saveInsights,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
