const Resource = require('../models/Resource');

/**
 * Get all resources with optional filters
 */
async function getResources(req, res) {
  try {
    const { category, language, tags, isEmergency } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (language) query.language = language;
    if (isEmergency) query.isEmergency = isEmergency === 'true';
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    const resources = await Resource.find(query)
      .sort({ isEmergency: -1, views: -1 })
      .limit(50);

    res.json({
      success: true,
      resources,
      count: resources.length
    });

  } catch (error) {
    console.error('Get Resources Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve resources'
    });
  }
}

/**
 * Get a single resource by ID
 */
async function getResourceById(req, res) {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Increment view count
    resource.views += 1;
    await resource.save();

    res.json({
      success: true,
      resource
    });

  } catch (error) {
    console.error('Get Resource Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve resource'
    });
  }
}

/**
 * Mark resource as helpful
 */
async function markHelpful(req, res) {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    resource.helpful += 1;
    await resource.save();

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      helpful: resource.helpful
    });

  } catch (error) {
    console.error('Mark Helpful Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resource'
    });
  }
}

/**
 * Get emergency helplines
 */
async function getEmergencyHelplines(req, res) {
  try {
    const helplines = await Resource.find({
      category: 'helpline',
      isEmergency: true
    }).sort({ helpful: -1 });

    res.json({
      success: true,
      helplines
    });

  } catch (error) {
    console.error('Get Helplines Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve helplines'
    });
  }
}

/**
 * Seed initial resources (run once)
 */
async function seedResources(req, res) {
  try {
    // Check if resources already exist
    const count = await Resource.countDocuments();
    if (count > 0) {
      return res.json({
        success: true,
        message: 'Resources already exist',
        count
      });
    }

    // Initial resources
    const initialResources = [
      // Emergency Helplines
      {
        title: 'Vandrevala Foundation Helpline',
        description: '24/7 free mental health support and crisis intervention',
        category: 'helpline',
        content: 'Call: 1860-2662-345 or 1800-2333-330 (Toll-free). Available 24/7 in English, Hindi, and other Indian languages.',
        language: 'en',
        tags: ['crisis', 'suicide-prevention', '24/7', 'free'],
        isEmergency: true
      },
      {
        title: 'AASRA Suicide Prevention',
        description: '24/7 crisis helpline for suicide prevention',
        category: 'helpline',
        content: 'Call: 91-9820466726. Email: aasrahelpline@yahoo.com. Available 24/7.',
        language: 'en',
        tags: ['crisis', 'suicide-prevention', '24/7'],
        isEmergency: true
      },
      {
        title: 'iCall Psychosocial Helpline',
        description: 'Professional counseling by trained psychologists',
        category: 'helpline',
        content: 'Call: 91-9152987821. Email: icall@tiss.edu. Monday-Saturday, 8 AM - 10 PM.',
        language: 'en',
        tags: ['counseling', 'professional', 'tiss'],
        isEmergency: true
      },

      // Breathing Exercises
      {
        title: '4-7-8 Breathing Technique',
        description: 'A simple breathing exercise to reduce anxiety',
        category: 'exercise',
        content: '1. Breathe in through your nose for 4 counts\n2. Hold your breath for 7 counts\n3. Exhale through your mouth for 8 counts\n4. Repeat 4 times\n\nThis helps calm your nervous system.',
        language: 'en',
        tags: ['anxiety', 'breathing', 'quick-relief'],
        difficulty: 'beginner',
        duration: 5
      },

      // Articles
      {
        title: 'Understanding Exam Stress',
        description: 'Tips for managing academic pressure',
        category: 'article',
        content: 'Exam stress is normal, but manageable. Try these strategies:\n1. Break study time into 25-minute chunks\n2. Take regular breaks\n3. Sleep 7-8 hours\n4. Talk to friends or family\n5. Remember: One exam doesn\'t define you',
        language: 'en',
        tags: ['academic', 'stress', 'exams', 'students'],
        difficulty: 'beginner',
        duration: 10
      },

      // Meditation
      {
        title: '5-Minute Mindfulness Meditation',
        description: 'Quick meditation for busy students',
        category: 'meditation',
        content: '1. Sit comfortably, close your eyes\n2. Focus on your breath\n3. When your mind wanders, gently bring it back\n4. Notice 5 things you can hear\n5. Take 5 deep breaths\n\nEven 5 minutes can make a difference!',
        language: 'en',
        tags: ['mindfulness', 'meditation', 'quick', 'beginner'],
        difficulty: 'beginner',
        duration: 5
      }
    ];

    await Resource.insertMany(initialResources);

    res.json({
      success: true,
      message: 'Resources seeded successfully',
      count: initialResources.length
    });

  } catch (error) {
    console.error('Seed Resources Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed resources'
    });
  }
}

module.exports = {
  getResources,
  getResourceById,
  markHelpful,
  getEmergencyHelplines,
  seedResources
};