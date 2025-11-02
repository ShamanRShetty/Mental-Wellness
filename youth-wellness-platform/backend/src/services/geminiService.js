const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Detect language from text
 */
function detectLanguageFromText(text) {
  const hindiPattern = /[\u0900-\u097F]/;
  const tamilPattern = /[\u0B80-\u0BFF]/;
  const kannadaPattern = /[\u0C80-\u0CFF]/;
  const teluguPattern = /[\u0C00-\u0C7F]/;
  const malayalamPattern = /[\u0D00-\u0D7F]/;
  
  if (hindiPattern.test(text)) return 'hi';
  if (tamilPattern.test(text)) return 'ta';
  if (kannadaPattern.test(text)) return 'kn';
  if (teluguPattern.test(text)) return 'te';
  if (malayalamPattern.test(text)) return 'ml';
  return 'en';
}

/**
 * Get system instruction based on detected language
 */
function getSystemInstruction(language) {
  const baseInstruction = `You are a compassionate mental wellness companion for Indian youth (ages 15-25). Your role is to:

1. Listen empathetically and validate their feelings
2. Provide emotional support in a warm, non-judgmental way
3. Use simple, conversational language (like a supportive friend)
4. Be culturally aware of Indian context (family dynamics, academic pressure, festivals, social norms)
5. NEVER provide medical diagnoses or treatment advice
6. Encourage professional help when needed
7. Keep responses concise (2-4 sentences usually)
8. Ask follow-up questions to understand better
9. Maintain appropriate boundaries

Cultural Context:
- Understand exam pressure (JEE, NEET, Board exams)
- Respect family dynamics and expectations
- Be sensitive to mental health stigma in India
- Use occasional Hindi/Hinglish words naturally where appropriate

Safety:
- If user mentions self-harm or suicide, respond with concern and provide helpline numbers
- Always prioritize user safety`;

  const languageSpecificInstructions = {
    en: baseInstruction + `\n\nIMPORTANT: The user is writing in English. Respond in English. You may use some Hindi/Hinglish words naturally (like "tension", "pressure") where it feels conversational.`,

    hi: baseInstruction + `\n\nCRITICAL INSTRUCTION: The user is writing in Hindi (Devanagari script). You MUST respond ONLY in Hindi (हिंदी में). Use natural, youth-friendly Hindi. Example: "मैं समझ सकता हूं कि तुम्हें exams को लेकर tension हो रही है।"`,

    ta: baseInstruction + `\n\nCRITICAL INSTRUCTION: The user is writing in Tamil (Tamil script). You MUST respond ONLY in Tamil (தமிழில்). Use natural, conversational Tamil. Example: "உங்களுக்கு தேர்வுகளைப் பற்றி கவலை இருப்பதை நான் புரிந்துகொள்கிறேன்."`,

    kn: baseInstruction + `\n\nCRITICAL INSTRUCTION: The user is writing in Kannada (Kannada script). You MUST respond ONLY in Kannada (ಕನ್ನಡದಲ್ಲಿ). Use natural, conversational Kannada. Example: "ನೀವು ಪರೀಕ್ಷೆಗಳ ಬಗ್ಗೆ ಚಿಂತಿಸುತ್ತಿರುವುದು ನನಗೆ ಅರ್ಥವಾಗುತ್ತದೆ."`,

    te: baseInstruction + `\n\nCRITICAL INSTRUCTION: The user is writing in Telugu (Telugu script). You MUST respond ONLY in Telugu (తెలుగులో). Use natural, conversational Telugu. Example: "మీకు పరీక్షల గురించి ఆందోళనగా ఉందని నేను అర్థం చేసుకున్నాను."`,

    ml: baseInstruction + `\n\nCRITICAL INSTRUCTION: The user is writing in Malayalam (Malayalam script). You MUST respond ONLY in Malayalam (മലയാളത്തിൽ). Use natural, conversational Malayalam. Example: "നിനക്ക് പരീക്ഷകളെ കുറിച്ച് ആശങ്കയുണ്ടെന്ന് എനിക്ക് മനസ്സിലാകുന്നു."`,
  };

  return languageSpecificInstructions[language] || languageSpecificInstructions.en;
}

/**
 * Rate limiting tracker
 */
let requestCount = {
  daily: 0,
  minute: 0,
  lastReset: new Date(),
  lastMinuteReset: new Date(),
};

function checkRateLimit() {
  const now = new Date();

  if (now.getDate() !== requestCount.lastReset.getDate()) {
    requestCount.daily = 0;
    requestCount.lastReset = now;
  }

  if (now - requestCount.lastMinuteReset > 60000) {
    requestCount.minute = 0;
    requestCount.lastMinuteReset = now;
  }

  const maxDaily = parseInt(process.env.MAX_REQUESTS_PER_DAY) || 1000;
  const maxMinute = parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 50;

  if (requestCount.daily >= maxDaily) {
    throw new Error('Daily API limit reached. Please try tomorrow.');
  }

  if (requestCount.minute >= maxMinute) {
    throw new Error('Rate limit exceeded. Please wait a minute.');
  }

  requestCount.daily++;
  requestCount.minute++;
}

/**
 * Cache
 */
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

function getCacheKey(message, historyLength, language) {
  return `${language}_${message.toLowerCase().trim()}_${historyLength}`;
}

/**
 * Common Responses
 */
const commonResponses = {
  en: {
    hi: "Hello! I'm here to listen and support you. How are you feeling today?",
    hello: "Hi there! This is a safe space. What would you like to talk about?",
    hey: "Hey! I'm glad you're here. What's on your mind?",
    thank: "You're very welcome! I'm here whenever you need support. 💙",
    bye: "Take care! Remember, I'm here whenever you need support. ✨",
  },
  hi: {
    'नमस्ते': "नमस्ते! मैं आपकी बात सुनने और सहायता करने के लिए यहां हूं। आज आप कैसा महसूस कर रहे हैं?",
    'धन्यवाद': "आपका स्वागत है! जब भी ज़रूरत हो, वापस आएं। 💙",
    'बाय': "अपना ख्याल रखें! मैं हमेशा यहां हूं। ✨",
  },
  kn: {
  hi: "ಹಲೋ! ನಾನು ಇಲ್ಲಿ ನಿಮ್ಮನ್ನು ಕೇಳಲು ಮತ್ತು ಬೆಂಬಲಿಸಲು ಇದ್ದೇನೆ. ಇಂದು ನಿಮ್ಮ ಮನಸ್ಥಿತಿ ಹೇಗಿದೆ?",
  hello: "ಹಾಯ್! ಇದು ಸುರಕ್ಷಿತ ಸ್ಥಳ. ನೀವು ಯಾವ ವಿಷಯದ ಬಗ್ಗೆ ಮಾತನಾಡಲು ಇಷ್ಟಪಡುತ್ತೀರಿ?",
  hey: "ಹೇ! ನೀವು ಇಲ್ಲಿ ಬಂದಿದ್ದಕ್ಕೆ ಸಂತೋಷವಾಗಿದೆ. ನಿಮ್ಮ ಮನಸ್ಸಿನಲ್ಲಿ ಏನು ಇದೆ?",
  thank: "ಸ್ವಾಗತ! ನಿಮಗೆ ಯಾವಾಗ ಬೇಕಾದರೂ ನಾನು ಇಲ್ಲಿ ಇದ್ದೇನೆ. 💙",
  bye: "ಜಾಗ್ರತೆ ವಹಿಸಿ! ನಿಮಗೆ ಬೆಂಬಲ ಬೇಕಾದಾಗ ಯಾವಾಗ ಬೇಕಾದರೂ ನಾನು ಇಲ್ಲಿ ಇದ್ದೇನೆ. ✨",
},
ml: {
  hi: "ഹലോ! ഞാൻ നിങ്ങളെ കേൾക്കാനും പിന്തുണയ്ക്കാനും ഇവിടെ ഉണ്ടെന്ന് അറിയുക. ഇന്ന് നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?",
  hello: "ഹായ്! ഇത് ഒരു സുരക്ഷിതമായ സ്ഥലം. എന്തിനെക്കുറിച്ച് സംസാരിക്കാൻ ആഗ്രഹിക്കുന്നു?",
  hey: "ഹേയ്! നിങ്ങളെ കാണാനായതിൽ സന്തോഷം. നിങ്ങളുടെ മനസിൽ എന്താണ്?",
  thank: "സ്വാഗതം! നിങ്ങളെ പിന്തുണയ്ക്കാൻ എനിക്ക് എല്ലായ്പ്പോഴും ഇവിടെ ഉണ്ടാകും. 💙",
  bye: "ശ്രദ്ധയോടെ ഇരിക്കുക! നിങ്ങളെ പിന്തുണയ്ക്കാൻ ഞാൻ എപ്പോഴും ഇവിടെ ഉണ്ടാകും. ✨",
},
te: {
  hi: "హలో! నేను వినడానికి మరియు మిమ్మల్ని ప్రోత్సహించడానికి ఇక్కడ ఉన్నాను. ఈరోజు మీరు ఎలా ఫీల్ అవుతున్నారు?",
  hello: "హాయ్! ఇది ఒక సురక్షితమైన స్థలం. మీరు ఏ విషయం గురించి మాట్లాడాలనుకుంటున్నారు?",
  hey: "హే! మీరు ఇక్కడ ఉన్నందుకు సంతోషంగా ఉంది. మీ మనసులో ఏముంది?",
  thank: "మీకు స్వాగతం! మీకు అవసరం ఉన్నప్పుడు నేను ఎప్పుడూ ఇక్కడ ఉంటాను. 💙",
  bye: "జాగ్రత్తగా ఉండండి! మీకు మద్దతు అవసరం ఉన్నప్పుడు ఎప్పుడైనా నేను ఇక్కడ ఉంటాను. ✨",
},
ta: {
  hi: "வணக்கம்! நான் உங்களை கேட்கவும், ஆதரிக்கவும் இங்கே இருக்கிறேன். இன்று உங்கள் மனநிலை எப்படி இருக்கிறது?",
  hello: "ஹாய்! இது ஒரு பாதுகாப்பான இடம். நீங்கள் எதைப் பற்றி பேச விரும்புகிறீர்கள்?",
  hey: "ஹே! நீங்கள் இங்கே வந்ததற்கு மகிழ்ச்சி. உங்கள் மனதில் என்ன இருக்கிறது?",
  thank: "உங்களை வரவேற்கிறேன்! உங்களுக்கு தேவையான நேரத்தில் நான் எப்போதும் இங்கே இருப்பேன். 💙",
  bye: "கவனமாக இருங்கள்! உங்களுக்கு ஆதரவு தேவைப்பட்டால் நான் எப்போதும் இங்கே இருப்பேன். ✨",
},
};

function getCommonResponse(message, language) {
  const normalized = message.toLowerCase().trim();
  return commonResponses[language]?.[normalized] || null;
}
async function generateMoodInsights(sessionId, moodLogs) {
  try {
    if (!moodLogs || moodLogs.length < 3) {
      return {
        success: false,
        message: "Need at least 3 entries to generate insights",
      };
    }

    const latestLogs = moodLogs.slice(0, 5); // last 5 entries max
    const textSummary = latestLogs
      .map(
        (m, i) =>
          `${i + 1}. Mood: ${m.mood} (Intensity: ${m.intensity}/10) | Note: ${
            m.note || "None"
          }`
      )
      .join("\n");

    const prompt = `
Analyze this user's recent mood logs and give:
1. A short AI analysis (2–3 sentences)
2. 2 recommendations for emotional well-being
3. Mood statistics (totalEntries, mostCommonMood, trend, averageIntensity)

Logs:
${textSummary}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // simple parse
    return {
      success: true,
      insights: {
        aiAnalysis: text.split("\n")[0] || text,
        recommendations: [{ message: text.split("\n")[1] || "Keep tracking!" }],
        statistics: {
          totalEntries: moodLogs.length,
          mostCommonMood: moodLogs[0].mood,
          trend: "stable",
          averageIntensity: (
            moodLogs.reduce((a, b) => a + b.intensity, 0) / moodLogs.length
          ).toFixed(1),
        },
      },
    };
  } catch (err) {
    console.error("AI insight generation error:", err);
    return { success: false, message: "AI generation failed." };
  }
}

module.exports = { generateMoodInsights };

/**
 * Generate AI response with fixed multilingual handling
 */
async function generateAIResponse(userMessage, conversationHistory = []) {
  try {
    const detectedLanguage = detectLanguageFromText(userMessage);
    console.log(`🌐 Detected language: ${detectedLanguage}`);

    const commonResp = getCommonResponse(userMessage, detectedLanguage);
    if (commonResp) return { message: commonResp, language: detectedLanguage };

    if (process.env.ENABLE_CACHING === 'true') {
      const cacheKey = getCacheKey(userMessage, conversationHistory.length, detectedLanguage);
      const cached = responseCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return { message: cached.response, language: detectedLanguage };
      }
    }

    checkRateLimit();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: getSystemInstruction(detectedLanguage),
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 300,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    });

    const recentHistory = conversationHistory.slice(-10);
    let conversationContext = '';
    if (recentHistory.length > 0) {
      conversationContext = recentHistory
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      conversationContext += '\n\n';
    }

    // 🔥 Force language response
    const prompt = `${conversationContext}User (${detectedLanguage}): ${userMessage}\n\nAssistant (reply ONLY in ${detectedLanguage}):`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log(`✅ Gemini replied in ${detectedLanguage}`);

    if (process.env.ENABLE_CACHING === 'true') {
      const cacheKey = getCacheKey(userMessage, conversationHistory.length, detectedLanguage);
      responseCache.set(cacheKey, { response, timestamp: Date.now() });
      if (responseCache.size > 100) responseCache.delete(responseCache.keys().next().value);
    }

    return { message: response, language: detectedLanguage };
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return {
      message: "I'm having trouble connecting right now, but I'm here for you.",
      language: 'en',
    };
  }
}

/**
 * Greeting
 */
function generateContextualGreeting() {
  const hour = new Date().getHours();
  let timeGreeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Hello';
  const greetings = [
    `${timeGreeting}! I'm here to listen. How are you feeling today?`,
    `${timeGreeting}! This is a safe space. What's on your mind?`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Intent detection
 */
function detectMessageIntent(message) {
  const lower = message.toLowerCase();
  if (/^(hi|hello|hey|namaste|नमस्ते|ನಮಸ್ಕಾರ|ஹாய்|வணக்கம்|హాయ్|നമസ്തേ)\b/.test(lower))
    return 'greeting';
  if (/(thank|धन्यवाद|ಧನ್ಯವಾದ|நன்றி|ధన్యవాదాలు|നന്ദി)/.test(lower)) return 'gratitude';
  if (/(bye|goodbye|बाय|ಬೈ|பை|బై|ബൈ)/.test(lower)) return 'goodbye';
  return 'conversation';
}

/**
 * Rate limit status
 */
function getRateLimitStatus() {
  return {
    daily: {
      used: requestCount.daily,
      limit: parseInt(process.env.MAX_REQUESTS_PER_DAY) || 1000,
    },
    minute: {
      used: requestCount.minute,
      limit: parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 50,
    },
  };
}

module.exports = {
  generateAIResponse,
  generateContextualGreeting,
  detectMessageIntent,
  getRateLimitStatus,
  detectLanguageFromText,
};
