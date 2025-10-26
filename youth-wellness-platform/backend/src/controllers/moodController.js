const Session = require('../models/Session');
const { generateSessionId, isValidSessionId } = require('../utils/sessionUtils');
const { analyzeSentimentTrend } = require('../services/sentimentService');
const { generateAIResponse } = require('../services/aiService');

/**
 * Log a mood entry
 */
async function logMood(req, res) {
  try {
    const { sessionId, mood, intensity, note, activities, triggers } = req.body;

    // Validation
    if (!sessionId || !mood) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and mood are required'
      });
    }

    if (!isValidSessionId(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID'
      });
    }

    const validMoods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mood value'
      });
    }

    // Find session
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Add mood entry
    const moodEntry = {
      mood,
      intensity: intensity || 5,
      note: note || '',
      activities: activities || [],
      triggers: triggers || [],
      timestamp: new Date()
    };

    session.moodEntries.push(moodEntry);
    await session.save();

    // Generate insights if there are enough entries
    let insights = null;
    if (session.moodEntries.length >= 3) {
      insights = await generateMoodInsights(session.moodEntries);
    }

    res.json({
      success: true,
      message: 'Mood logged successfully',
      moodEntry,
      insights,
      totalEntries: session.moodEntries.length
    });

  } catch (error) {
    console.error('Log Mood Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log mood'
    });
  }
}

/**
 * Get mood history
 */
async function getMoodHistory(req, res) {
  try {
    const { sessionId } = req.params;
    const { days } = req.query; // Optional: filter by days

    if (!isValidSessionId(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID'
      });
    }

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    let moodEntries = session.moodEntries;

    // Filter by days if specified
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      moodEntries = moodEntries.filter(entry => 
        new Date(entry.timestamp) >= daysAgo
      );
    }

    // Calculate statistics
    const stats = calculateMoodStatistics(moodEntries);

    res.json({
      success: true,
      moodEntries,
      statistics: stats,
      totalEntries: moodEntries.length
    });

  } catch (error) {
    console.error('Get Mood History Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve mood history'
    });
  }
}

/**
 * Get mood insights and patterns
 */
async function getMoodInsights(req, res) {
  try {
    const { sessionId } = req.params;

    if (!isValidSessionId(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID'
      });
    }

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    if (session.moodEntries.length < 3) {
      return res.json({
        success: true,
        message: 'Not enough data for insights. Keep logging your mood!',
        insights: null
      });
    }

    const insights = await generateMoodInsights(session.moodEntries);

    res.json({
      success: true,
      insights
    });

  } catch (error) {
    console.error('Get Mood Insights Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
}

/**
 * Helper: Calculate mood statistics
 */
function calculateMoodStatistics(moodEntries) {
  if (moodEntries.length === 0) {
    return {
      averageIntensity: 0,
      moodDistribution: {},
      mostCommonMood: null,
      trend: 'neutral'
    };
  }

  // Calculate average intensity
  const totalIntensity = moodEntries.reduce((sum, entry) => sum + entry.intensity, 0);
  const averageIntensity = totalIntensity / moodEntries.length;

  // Mood distribution
  const moodDistribution = {};
  moodEntries.forEach(entry => {
    moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
  });

  // Most common mood
  const mostCommonMood = Object.keys(moodDistribution).reduce((a, b) => 
    moodDistribution[a] > moodDistribution[b] ? a : b
  );

  // Calculate trend (comparing first half to second half)
  const moodValues = {
    very_sad: 1,
    sad: 2,
    neutral: 3,
    happy: 4,
    very_happy: 5
  };

  const midPoint = Math.floor(moodEntries.length / 2);
  const firstHalf = moodEntries.slice(0, midPoint);
  const secondHalf = moodEntries.slice(midPoint);

  const firstAvg = firstHalf.reduce((sum, e) => sum + moodValues[e.mood], 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, e) => sum + moodValues[e.mood], 0) / secondHalf.length;

  let trend = 'stable';
  if (secondAvg > firstAvg + 0.5) trend = 'improving';
  else if (secondAvg < firstAvg - 0.5) trend = 'declining';

  // Common triggers
  const allTriggers = moodEntries.flatMap(e => e.triggers || []);
  const triggerCount = {};
  allTriggers.forEach(trigger => {
    triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
  });

  const commonTriggers = Object.entries(triggerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trigger]) => trigger);

  // Helpful activities
  const allActivities = moodEntries.flatMap(e => e.activities || []);
  const activityCount = {};
  allActivities.forEach(activity => {
    activityCount[activity] = (activityCount[activity] || 0) + 1;
  });

  const helpfulActivities = Object.entries(activityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([activity]) => activity);

  return {
    averageIntensity: parseFloat(averageIntensity.toFixed(1)),
    moodDistribution,
    mostCommonMood,
    trend,
    commonTriggers,
    helpfulActivities,
    totalEntries: moodEntries.length
  };
}

/**
 * Helper: Generate AI-powered mood insights
 */
async function generateMoodInsights(moodEntries) {
  const stats = calculateMoodStatistics(moodEntries);

  // Create a summary for AI to analyze
  const recentEntries = moodEntries.slice(-7); // Last 7 entries
  const summary = recentEntries.map(e => 
    `${e.mood} (intensity: ${e.intensity}) - ${e.note || 'no note'}`
  ).join('\n');

  const prompt = `Based on this mood tracking data from a young person:

${summary}

Overall pattern: ${stats.mostCommonMood} mood most common, trend is ${stats.trend}
Common triggers: ${stats.commonTriggers.join(', ') || 'none noted'}
Helpful activities: ${stats.helpfulActivities.join(', ') || 'none noted'}

Provide brief, supportive insights (3-4 sentences):
1. Acknowledge their pattern
2. Point out something positive (even if small)
3. Give one gentle suggestion
Be warm and encouraging, not clinical.`;

  try {
    const aiInsights = await generateAIResponse(prompt, []);

    return {
      statistics: stats,
      aiAnalysis: aiInsights,
      recommendations: generateRecommendations(stats)
    };
  } catch (error) {
    console.error('Generate Insights Error:', error);
    return {
      statistics: stats,
      aiAnalysis: null,
      recommendations: generateRecommendations(stats)
    };
  }
}

/**
 * Helper: Generate recommendations based on mood patterns
 */
function generateRecommendations(stats) {
  const recommendations = [];

  // Based on trend
  if (stats.trend === 'improving') {
    recommendations.push({
      type: 'encouragement',
      message: 'Your mood has been improving! Keep up whatever you\'re doing - it\'s working! 🌟'
    });
  } else if (stats.trend === 'declining') {
    recommendations.push({
      type: 'support',
      message: 'I notice you\'ve been having a tough time lately. Consider reaching out to someone you trust or trying some self-care activities.'
    });
  }

  // Based on most common mood
  if (stats.mostCommonMood === 'very_sad' || stats.mostCommonMood === 'sad') {
    recommendations.push({
      type: 'resource',
      message: 'When you\'re feeling down, try: talking to a friend, going for a walk, or journaling your thoughts.'
    });
  }

  // Based on triggers
  if (stats.commonTriggers && stats.commonTriggers.length > 0) {
    recommendations.push({
      type: 'awareness',
      message: `I notice ${stats.commonTriggers[0]} comes up often. Being aware of your triggers is the first step to managing them.`
    });
  }

  // General wellness
  recommendations.push({
    type: 'wellness',
    message: 'Remember: Small consistent actions matter more than perfect days. You\'re doing great by tracking your mood!'
  });

  return recommendations;
}

module.exports = {
  logMood,
  getMoodHistory,
  getMoodInsights
};