const OpenAI = require('openai');
const { getRandomEncouragement } = require('../utils/responseTemplates');

// Initialize OpenAI (we'll switch to Gemini later)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * System prompt for the AI - defines its personality and behavior
 */
const SYSTEM_PROMPT = `You are a compassionate mental wellness companion for Indian youth (ages 15-25). Your role is to:

1. Listen empathetically and validate their feelings
2. Provide emotional support in a warm, non-judgmental way
3. Use simple, conversational language (like a supportive friend)
4. Be culturally aware of Indian context (family dynamics, academic pressure, festivals, social norms)
5. NEVER provide medical diagnoses or treatment advice
6. Encourage professional help when needed
7. Use inclusive language and respect all identities
8. Keep responses concise (2-4 sentences usually)
9. Ask follow-up questions to understand better
10. Maintain appropriate boundaries

Remember:
- You are NOT a therapist, doctor, or medical professional
- Always prioritize user safety
- If user mentions self-harm or suicide, respond with concern and provide helpline numbers
- Respect cultural sensitivities around mental health stigma in India
- Use Hindi words occasionally if it feels natural (like "tension", "pressure", "stress")

Tone: Warm, supportive, friend-like but professional`;

/**
 * Generate AI response using OpenAI
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - AI response
 */
async function generateAIResponse(userMessage, conversationHistory = []) {
  try {
    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add conversation history (last 10 messages to save tokens)
    const recentHistory = conversationHistory.slice(-10);
    messages.push(...recentHistory);

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Cheaper model for testing
      messages: messages,
      temperature: 0.7, // Balance between creative and focused
      max_tokens: 200, // Keep responses concise
      presence_penalty: 0.6, // Encourage diverse responses
      frequency_penalty: 0.3 // Reduce repetition
    });

    const aiMessage = response.choices[0].message.content.trim();
    
    // Add a random encouragement 10% of the time
    if (Math.random() < 0.1) {
      return `${aiMessage}\n\n${getRandomEncouragement()}`;
    }

    return aiMessage;

  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback response if AI fails
    return "I'm having trouble connecting right now, but I'm here for you. Could you tell me more about how you're feeling? Sometimes just expressing our thoughts can help.";
  }
}

/**
 * Generate a supportive greeting based on time of day
 */
function generateContextualGreeting() {
  const hour = new Date().getHours();
  let timeGreeting = '';

  if (hour < 12) {
    timeGreeting = 'Good morning';
  } else if (hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour < 21) {
    timeGreeting = 'Good evening';
  } else {
    timeGreeting = 'Hello';
  }

  const greetings = [
    `${timeGreeting}! I'm here to listen. How are you feeling today?`,
    `${timeGreeting}! This is a safe space. What's on your mind?`,
    `${timeGreeting}! I'm glad you're here. Would you like to talk about something?`
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Analyze if message needs special handling (greeting, gratitude, etc.)
 */
function detectMessageIntent(message) {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|namaste|hola)\b/i.test(lowerMessage)) {
    return 'greeting';
  }

  // Gratitude
  if (/(thank|thanks|grateful|appreciate)/i.test(lowerMessage)) {
    return 'gratitude';
  }

  // Goodbye
  if (/(bye|goodbye|see you|gotta go)/i.test(lowerMessage)) {
    return 'goodbye';
  }

  return 'conversation';
}

module.exports = {
  generateAIResponse,
  generateContextualGreeting,
  detectMessageIntent
};