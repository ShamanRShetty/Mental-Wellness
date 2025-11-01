const Journal = require('../models/Journal');
const { isValidSessionId } = require('../utils/sessionUtils');

/**
 * Create a new journal entry
 */
async function createEntry(req, res) {
  try {
    const { sessionId, title, content, mood, tags, prompt } = req.body;

    if (!sessionId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and content are required',
      });
    }

    if (!isValidSessionId(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID',
      });
    }

    const entry = new Journal({
      sessionId,
      title: title?.trim() || 'Untitled Entry',
      content,
      mood: mood || null,
      tags: Array.isArray(tags) ? tags : [],
      prompt: prompt || null,
    });

    await entry.save();

    res.json({
      success: true,
      entry,
      message: 'Journal entry created successfully',
    });
  } catch (error) {
    console.error('Create Entry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create journal entry',
    });
  }
}

/**
 * Get all journal entries for a session
 */
async function getEntries(req, res) {
  try {
    const { sessionId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    if (!isValidSessionId(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID',
      });
    }

    const entries = await Journal.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Journal.countDocuments({ sessionId });

    res.json({
      success: true,
      entries,
      total,
      count: entries.length,
    });
  } catch (error) {
    console.error('Get Entries Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve journal entries',
    });
  }
}

/**
 * Get a single journal entry
 */
async function getEntry(req, res) {
  try {
    const { id } = req.params;

    const entry = await Journal.findById(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found',
      });
    }

    res.json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error('Get Entry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve journal entry',
    });
  }
}

/**
 * Update a journal entry
 */
async function updateEntry(req, res) {
  try {
    const { id } = req.params;
    const { title, content, mood, tags } = req.body;

    const entry = await Journal.findById(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found',
      });
    }

    // Update fields
    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (mood !== undefined) entry.mood = mood;
    if (tags !== undefined) entry.tags = Array.isArray(tags) ? tags : [];
    entry.updatedAt = new Date();

    await entry.save();

    res.json({
      success: true,
      entry,
      message: 'Journal entry updated successfully',
    });
  } catch (error) {
    console.error('Update Entry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update journal entry',
    });
  }
}

/**
 * Delete a journal entry
 */
async function deleteEntry(req, res) {
  try {
    const { id } = req.params;

    const entry = await Journal.findByIdAndDelete(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found',
      });
    }

    res.json({
      success: true,
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    console.error('Delete Entry Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete journal entry',
    });
  }
}

/**
 * Get journal prompts
 */
async function getPrompts(req, res) {
  try {
    const prompts = [
      "What are three things you're grateful for today?",
      "Describe a challenge you faced today and how you handled it.",
      "What emotions did you experience today? Why?",
      "Write about someone who made you smile today.",
      "What's weighing on your mind right now?",
      "Describe a moment today when you felt proud of yourself.",
      "What would you tell your younger self about today?",
      "What's one thing you learned about yourself recently?",
      "If your feelings had colors today, what would they be?",
      "What do you need to forgive yourself for?",
      "Describe your ideal day. What would it look like?",
      "What boundaries do you need to set for your well-being?",
      "Write a letter to your future self one year from now.",
      "What are you avoiding thinking about? Why?",
      "What small win can you celebrate from today?",
    ];

    const randomPrompts = prompts.sort(() => 0.5 - Math.random()).slice(0, 5);

    res.json({
      success: true,
      prompts: randomPrompts,
    });
  } catch (error) {
    console.error('Get Prompts Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve prompts',
    });
  }
}

module.exports = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getPrompts,
};
