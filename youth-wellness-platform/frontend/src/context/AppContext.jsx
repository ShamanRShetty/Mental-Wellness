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

  // Initialize or restore session
  useEffect(() => {
    const initSession = async () => {
      try {
        // Try to get existing session from storage
        const existingSession = getSessionId();

        if (existingSession) {
          setSessionId(existingSession);
        } else {
          // Create new session
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

  // Handle session reset
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

  // Update preferences
  const updatePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    savePreferences(updated);
  };

  // Show crisis modal
  const triggerCrisisModal = (data) => {
    setCrisisData(data);
    setShowCrisisModal(true);
  };

  // Hide crisis modal
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};