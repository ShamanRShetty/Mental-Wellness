const { Translate } = require('@google-cloud/translate').v2;
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize clients
const translate = new Translate({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Track usage
 */
let translationCharsUsed = 0;
const MONTHLY_CHAR_LIMIT = 400000; // 400K chars (safety buffer)

/**
 * Translate text to target language
 */
async function translateText(text, targetLanguage = 'en') {
  try {
    // Skip translation if disabled
    if (process.env.USE_TRANSLATION !== 'true') {
      return text;
    }

    // Check character limit
    if (translationCharsUsed + text.length > MONTHLY_CHAR_LIMIT) {
      console.log('⚠️ Translation quota limit reached');
      return text;
    }

    // --- Gemini translation mode ---
    if (process.env.USE_TRANSLATION_GEMINI === 'true') {
      if (!targetLanguage || targetLanguage === 'en') return text;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Translate this text into ${targetLanguage}, keeping tone natural and emotionally supportive:
      "${text}"`;

      const result = await model.generateContent(prompt);
      const translation = result.response.text().trim();

      translationCharsUsed += text.length;
      console.log(`✅ Gemini translated to ${targetLanguage} (${translationCharsUsed} chars used this month)`);

      return translation;
    }

    // --- Default Google Cloud Translation ---
    const [translation] = await translate.translate(text, targetLanguage);

    translationCharsUsed += text.length;
    console.log(`✅ Translated to ${targetLanguage} (${translationCharsUsed} chars used this month)`);

    return translation;

  } catch (error) {
    console.error('Translation Error:', error);
    return text; // Return original on error
  }
}

/**
 * Detect language
 */
async function detectLanguage(text) {
  try {
    const [detection] = await translate.detect(text);
    return {
      language: detection.language,
      confidence: detection.confidence,
    };
  } catch (error) {
    console.error('Language Detection Error:', error);
    return { language: 'en', confidence: 0 };
  }
}

/**
 * Get supported languages
 */
async function getSupportedLanguages() {
  try {
    const [languages] = await translate.getLanguages();
    return languages;
  } catch (error) {
    console.error('Get Languages Error:', error);
    return [];
  }
}

module.exports = {
  translateText,
  detectLanguage,
  getSupportedLanguages,
};
