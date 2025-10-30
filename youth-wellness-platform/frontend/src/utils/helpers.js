/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
};

/**
 * Format time to readable string
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get mood emoji
 */
export const getMoodEmoji = (mood) => {
  const moodEmojis = {
    very_sad: '😢',
    sad: '😔',
    neutral: '😐',
    happy: '🙂',
    very_happy: '😊',
  };
  return moodEmojis[mood] || '😐';
};

/**
 * Get mood color
 */
export const getMoodColor = (mood) => {
  const moodColors = {
    very_sad: 'bg-red-100 text-red-700 border-red-200',
    sad: 'bg-orange-100 text-orange-700 border-orange-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    happy: 'bg-green-100 text-green-700 border-green-200',
    very_happy: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return moodColors[mood] || moodColors.neutral;
};

/**
 * Get mood label
 */
export const getMoodLabel = (mood) => {
  const moodLabels = {
    very_sad: 'Very Sad',
    sad: 'Sad',
    neutral: 'Neutral',
    happy: 'Happy',
    very_happy: 'Very Happy',
  };
  return moodLabels[mood] || 'Neutral';
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get greeting based on time
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

/**
 * Validate session ID
 */
export const isValidSessionId = (sessionId) => {
  return sessionId && /^sess_[a-f0-9]{32}$/.test(sessionId);
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};