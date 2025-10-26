const { crisisResponses } = require('../utils/responseTemplates');

/**
 * Crisis keywords categorized by severity
 */
const CRISIS_KEYWORDS = {
  critical: [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'better off dead', 'suicide plan', 'going to kill',
    'आत्महत्या', 'मरना चाहता', 'जीना नहीं चाहता' // Hindi
  ],
  high: [
    'self harm', 'cut myself', 'hurt myself', 'harm myself',
    'don\'t want to live', 'can\'t go on', 'no point living',
    'खुद को नुकसान', 'खुद को चोट' // Hindi
  ],
  medium: [
    'hopeless', 'worthless', 'no one cares', 'hate myself',
    'give up', 'can\'t take it anymore', 'overwhelming'
  ]
};

/**
 * Detect crisis level in user message
 * @param {string} message - User's message
 * @returns {Object} - Crisis detection result
 */
function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  let severity = 'none';
  let detectedKeywords = [];
  let score = 0;

  // Check critical keywords
  for (const keyword of CRISIS_KEYWORDS.critical) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      severity = 'critical';
      detectedKeywords.push(keyword);
      score += 3;
    }
  }

  // Check high severity keywords if not already critical
  if (severity !== 'critical') {
    for (const keyword of CRISIS_KEYWORDS.high) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        severity = 'high';
        detectedKeywords.push(keyword);
        score += 2;
      }
    }
  }

  // Check medium severity keywords
  if (severity === 'none') {
    for (const keyword of CRISIS_KEYWORDS.medium) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        severity = 'medium';
        detectedKeywords.push(keyword);
        score += 1;
      }
    }
  }

  // Sentiment-based detection
  const negativeWords = ['sad', 'depressed', 'anxious', 'lonely', 'scared', 'afraid'];
  const negativeCount = negativeWords.filter(word => 
    lowerMessage.includes(word)
  ).length;

  if (negativeCount >= 3 && severity === 'none') {
    severity = 'low';
    score += 0.5;
  }

  return {
    isCrisis: severity !== 'none',
    severity,
    score,
    keywords: detectedKeywords,
    timestamp: new Date()
  };
}

/**
 * Get appropriate crisis response based on severity
 * @param {string} severity - Crisis severity level
 * @returns {Object} - Crisis response with resources
 */
function getCrisisResponse(severity) {
  if (severity === 'critical' || severity === 'high') {
    return {
      severity,
      message: crisisResponses.high.message,
      helplines: crisisResponses.high.helplines,
      urgentActions: crisisResponses.high.urgentActions,
      showEmergencyButton: true
    };
  } else if (severity === 'medium') {
    return {
      severity,
      message: crisisResponses.medium.message,
      resources: crisisResponses.medium.resources,
      showEmergencyButton: false
    };
  } else if (severity === 'low') {
    return {
      severity,
      message: crisisResponses.low.message,
      suggestions: crisisResponses.low.suggestions,
      showEmergencyButton: false
    };
  }

  return null;
}

/**
 * Analyze conversation history for deteriorating mental state
 * @param {Array} conversationHistory - Recent conversation messages
 * @returns {Object} - Trend analysis
 */
function analyzeTrend(conversationHistory) {
  if (!conversationHistory || conversationHistory.length < 5) {
    return { trend: 'neutral', confidence: 'low' };
  }

  // Analyze last 10 messages
  const recentMessages = conversationHistory.slice(-10);
  let crisisScore = 0;
  let totalMessages = 0;

  recentMessages.forEach((msg, index) => {
    if (msg.role === 'user') {
      totalMessages++;
      const detection = detectCrisis(msg.content);
      
      // Weight recent messages more heavily
      const weight = (index + 1) / recentMessages.length;
      crisisScore += detection.score * weight;
    }
  });

  const avgScore = crisisScore / totalMessages;

  let trend = 'neutral';
  let confidence = 'medium';

  if (avgScore > 2) {
    trend = 'worsening';
    confidence = 'high';
  } else if (avgScore > 1) {
    trend = 'concerning';
    confidence = 'medium';
  } else if (avgScore > 0.5) {
    trend = 'monitoring';
    confidence = 'low';
  } else {
    trend = 'stable';
    confidence = 'medium';
  }

  return {
    trend,
    confidence,
    avgScore,
    recommendation: getRecommendationBasedOnTrend(trend)
  };
}

function getRecommendationBasedOnTrend(trend) {
  const recommendations = {
    worsening: 'Consider reaching out to a professional counselor or therapist soon.',
    concerning: 'It might be helpful to talk to a trusted friend or family member.',
    monitoring: 'Keep checking in with yourself. You\'re doing well by talking about it.',
    stable: 'You seem to be managing well. Keep up the self-care!'
  };

  return recommendations[trend] || recommendations.stable;
}

module.exports = {
  detectCrisis,
  getCrisisResponse,
  analyzeTrend
};