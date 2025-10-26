const Session = require('../models/Session');
const { generateAIResponse, generateContextualGreeting, detectMessageIntent } = require('../services/aiService');
const { detectCrisis, getCrisisResponse, analyzeTrend } = require('../services/crisisDetection');
const { analyzeSentiment } = require('../services/sentimentService');
const { v4: uuidv4 } = require('uuid');

/**
 * Initialize a new chat session
 */
async function initializeSession(req, res) {
  try {
    const sessionId = uuidv4(); // generate unique session id

    const session = await Session.create({
      sessionId, // assign it here
      conversationHistory: [],
      moodEntries: [],
      preferences: {
        language: req.body.language || 'en'
      }
    });

    const greeting = generateContextualGreeting();

    res.json({
      success: true,
      sessionId,
      message: greeting,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Initialize Session Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize session'
    });
  }
}

/**
 * Handle chat message
 */
async function sendMessage(req, res) {
  try {
    const { sessionId, message } = req.body;

    // Validation
    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and message are required'
      });
    }

    if (!sessionId || sessionId.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID'
      });
    }

    // Find session
    let session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found. Please start a new session.'
      });
    }

    // Analyze message sentiment
    const sentiment = analyzeSentiment(message);

    // Detect crisis
    const crisisDetection = detectCrisis(message);

    // Check message intent
    const intent = detectMessageIntent(message);

    // Add user message to history
    session.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
      sentiment: {
        score: sentiment.score,
        magnitude: sentiment.magnitude
      }
    });

    // Generate AI response
    let aiResponse;
    
    if (intent === 'greeting') {
      aiResponse = generateContextualGreeting();
    } else if (intent === 'gratitude') {
      aiResponse = "You're very welcome! I'm here whenever you need to talk. Take care of yourself! 💙";
    } else if (intent === 'goodbye') {
      aiResponse = "Take care! Remember, I'm here whenever you need support. You're doing great by taking care of your mental health. 🌟";
    } else {
      // Convert history to format expected by AI service
      const conversationHistory = session.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      aiResponse = await generateAIResponse(message, conversationHistory);
    }

    // Add AI response to history
    session.conversationHistory.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Save crisis event if detected
    if (crisisDetection.isCrisis) {
      session.crisisEvents.push({
        detected: true,
        severity: crisisDetection.severity,
        keywords: crisisDetection.keywords,
        timestamp: new Date(),
        responseProvided: true
      });
    }

    // Save session
    await session.save();

    // Analyze conversation trend
    const trend = analyzeTrend(session.conversationHistory);

    // Prepare response
    const response = {
      success: true,
      message: aiResponse,
      sentiment: {
        userSentiment: sentiment.sentiment,
        score: sentiment.score
      },
      timestamp: new Date()
    };

    // Add crisis information if detected
    if (crisisDetection.isCrisis) {
      response.crisis = {
        detected: true,
        ...getCrisisResponse(crisisDetection.severity)
      };
    }

    // Add trend warning if concerning
    if (trend.trend === 'worsening' || trend.trend === 'concerning') {
      response.trend = {
        status: trend.trend,
        recommendation: trend.recommendation
      };
    }

    res.json(response);

  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      fallbackMessage: "I'm having trouble responding right now, but I'm here for you. Could you try sending your message again?"
    });
  }
}

/**
 * Get conversation history
 */
async function getConversationHistory(req, res) {
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

    res.json({
      success: true,
      history: session.conversationHistory,
      totalMessages: session.conversationHistory.length,
      lastActive: session.lastActive
    });

  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversation history'
    });
  }
}

/**
 * Clear conversation history (while keeping session)
 */
async function clearHistory(req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId || sessionId.length < 10) {
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

    // Keep crisis events but clear conversation
    session.conversationHistory = [];
    await session.save();

    res.json({
      success: true,
      message: 'Conversation history cleared',
      sessionId
    });

  } catch (error) {
    console.error('Clear History Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear history'
    });
  }
}

module.exports = {
  initializeSession,
  sendMessage,
  getConversationHistory,
  clearHistory
};