const language = require('@google-cloud/language');

// Initialize client
const client = new language.LanguageServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

/**
 * Track API usage
 */
let nlpUsageCount = 0;
const NLP_DAILY_LIMIT = 4000;

/**
 * Analyze sentiment using Google Cloud NLP (more accurate)
 */
async function analyzeWithCloudNLP(text) {
  try {
    // Check if we should use Cloud NLP
    if (process.env.USE_NLP_SENTIMENT !== 'true') {
      return null; // Fall back to basic sentiment
    }

    // Check usage limit
    if (nlpUsageCount >= NLP_DAILY_LIMIT) {
      console.log('⚠️ NLP daily limit reached, using basic sentiment');
      return null;
    }

    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };

    const [result] = await client.analyzeSentiment({ document });
    
    nlpUsageCount++;
    console.log(`✅ Cloud NLP call successful (${nlpUsageCount} today)`);

    const sentiment = result.documentSentiment;

    return {
      score: sentiment.score, // -1 to 1
      magnitude: sentiment.magnitude, // 0 to infinity
      sentiment: getSentimentLabel(sentiment.score),
      confidence: Math.abs(sentiment.score),
      usedCloudNLP: true,
    };

  } catch (error) {
    console.error('Cloud NLP Error:', error);
    return null; // Fall back to basic sentiment
  }
}

function getSentimentLabel(score) {
  if (score > 0.3) return 'positive';
  if (score > 0.1) return 'slightly_positive';
  if (score < -0.3) return 'negative';
  if (score < -0.1) return 'slightly_negative';
  return 'neutral';
}

module.exports = {
  analyzeWithCloudNLP,
};