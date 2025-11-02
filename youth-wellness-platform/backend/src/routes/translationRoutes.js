const express = require('express');
const router = express.Router();
const { translateText, detectLanguage } = require('../services/translationService');

router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const translated = await translateText(text, targetLanguage || 'en');
    
    res.json({
      success: true,
      original: text,
      translated,
      targetLanguage,
    });

  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const detection = await detectLanguage(text);
    
    res.json({
      success: true,
      ...detection,
    });

  } catch (error) {
    console.error('Detection Error:', error);
    res.status(500).json({ error: 'Detection failed' });
  }
});

module.exports = router;