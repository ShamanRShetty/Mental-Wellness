const { analyzeWithCloudNLP } = require('./cloudNLPService');

/**
 * Basic sentiment analysis
 * (We'll replace this with Google Cloud NLP API later)
 */

const POSITIVE_WORDS = [
  'happy', 'joy', 'excited', 'grateful', 'thankful', 'blessed',
  'wonderful', 'amazing', 'great', 'excellent', 'love', 'better',
  'improved', 'progress', 'hopeful', 'proud', 'accomplished'
];

const NEGATIVE_WORDS = [
  'sad', 'depressed', 'anxious', 'worried', 'scared', 'afraid',
  'hopeless', 'worthless', 'lonely', 'isolated', 'stressed',
  'overwhelmed', 'exhausted', 'tired', 'frustrated', 'angry',
  'hate', 'terrible', 'awful', 'worse', 'failed'
];

/**
 * Analyze sentiment of a message
 * @param {string} text - Message to analyze
 * @returns {Object} - Sentiment analysis result
 */
async function analyzeSentiment(text) {
  // Try Cloud NLP first
  const cloudResult = await analyzeWithCloudNLP(text);
  if (cloudResult) {
    return cloudResult;
  }

  // Fall back to basic sentiment (existing code)
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;

  // Count positive and negative words
  words.forEach(word => {
    if (POSITIVE_WORDS.some(pw => word.includes(pw))) {
      positiveCount++;
    }
    if (NEGATIVE_WORDS.some(nw => word.includes(nw))) {
      negativeCount++;
    }
  });

  // Calculate sentiment score (-1 to 1)
  const totalSentimentWords = positiveCount + negativeCount;
  let score = 0;

  if (totalSentimentWords > 0) {
    score = (positiveCount - negativeCount) / totalSentimentWords;
  }

  // Calculate magnitude (0 to 1) - how strong the emotion is
  const magnitude = totalSentimentWords / words.length;

  // Determine overall sentiment
  let sentiment = 'neutral';
  if (score > 0.3) sentiment = 'positive';
  else if (score > 0.1) sentiment = 'slightly_positive';
  else if (score < -0.3) sentiment = 'negative';
  else if (score < -0.1) sentiment = 'slightly_negative';

  return {
    score, // -1 (very negative) to 1 (very positive)
    magnitude, // 0 (no emotion) to 1 (very emotional)
    sentiment, // 'positive', 'negative', 'neutral', etc.
    positiveCount,
    negativeCount,
    confidence: Math.abs(score), // How confident we are
    usedCloudNLP: false, // flag for fallback usage
  };
}

/**
 * Analyze sentiment trend over multiple messages
 * @param {Array} messages - Array of messages with timestamps
 * @returns {Object} - Trend analysis
 */
function analyzeSentimentTrend(messages) {
  if (!messages || messages.length === 0) {
    return {
      trend: 'neutral',
      avgScore: 0,
      improvement: 0
    };
  }

  const sentiments = messages.map(msg => {
    const analysis = analyzeSentiment(msg.content);
    return {
      ...analysis,
      timestamp: msg.timestamp
    };
  });

  // Calculate average sentiment
  const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;

  // Calculate trend (comparing first half to second half)
  const midPoint = Math.floor(sentiments.length / 2);
  const firstHalf = sentiments.slice(0, midPoint);
  const secondHalf = sentiments.slice(midPoint);

  const firstAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length;

  const improvement = secondAvg - firstAvg;

  let trend = 'stable';
  if (improvement > 0.2) trend = 'improving';
  else if (improvement < -0.2) trend = 'declining';

  return {
    trend,
    avgScore,
    improvement,
    recentSentiment: secondAvg,
    details: sentiments
  };
}

module.exports = {
  analyzeSentiment, // now async
  analyzeSentimentTrend
};
