/**
 * Local storage helper with error handling
 */

const STORAGE_KEYS = {
  SESSION_ID: 'youth_wellness_session_id',
  USER_PREFERENCES: 'youth_wellness_preferences',
  ONBOARDING_COMPLETE: 'youth_wellness_onboarding',
};

/**
 * Save to local storage
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

/**
 * Get from local storage
 */
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

/**
 * Remove from local storage
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from storage:', error);
    return false;
  }
};

/**
 * Clear all storage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// ============================================
// APP-SPECIFIC STORAGE FUNCTIONS
// ============================================

/**
 * Save session ID
 */
export const saveSessionId = (sessionId) => {
  return saveToStorage(STORAGE_KEYS.SESSION_ID, sessionId);
};

/**
 * Get session ID
 */
export const getSessionId = () => {
  return getFromStorage(STORAGE_KEYS.SESSION_ID);
};

/**
 * Clear session ID
 */
export const clearSessionId = () => {
  return removeFromStorage(STORAGE_KEYS.SESSION_ID);
};

/**
 * Save user preferences
 */
export const savePreferences = (preferences) => {
  return saveToStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

/**
 * Get user preferences
 */
export const getPreferences = () => {
  return getFromStorage(STORAGE_KEYS.USER_PREFERENCES) || {
    language: 'en',
    theme: 'light',
    notifications: true,
  };
};

/**
 * Mark onboarding as complete
 */
export const setOnboardingComplete = () => {
  return saveToStorage(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
};

/**
 * Check if onboarding is complete
 */
export const isOnboardingComplete = () => {
  return getFromStorage(STORAGE_KEYS.ONBOARDING_COMPLETE) === true;
};