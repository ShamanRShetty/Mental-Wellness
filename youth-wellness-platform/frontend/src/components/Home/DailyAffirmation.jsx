import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import Button from '../UI/Button';

const DailyAffirmation = () => {
  const [affirmation, setAffirmation] = useState(null);

  const affirmations = [
    { text: "You are stronger than you think, and braver than you believe.", category: "Strength" },
    { text: "It's okay to not be okay. Your feelings are valid.", category: "Validation" },
    { text: "Taking care of your mental health is not selfish, it's essential.", category: "Self-care" },
    { text: "You don't have to be perfect. Progress, not perfection.", category: "Growth" },
    { text: "Your mental health journey is unique. Don't compare it to others.", category: "Acceptance" },
    { text: "Small steps forward are still steps forward. Celebrate them.", category: "Progress" },
    { text: "You are worthy of love, support, and happiness.", category: "Self-worth" },
    { text: "Tough times don't last, but tough people do. You've got this.", category: "Resilience" },
    { text: "It's brave to ask for help. You don't have to face this alone.", category: "Courage" },
    { text: "Your story isn't over yet. Better chapters are coming.", category: "Hope" },
    { text: "You've survived 100% of your worst days. That's powerful.", category: "Survival" },
    { text: "Be gentle with yourself. You're doing the best you can.", category: "Compassion" },
    { text: "Your mental health matters more than your grades or achievements.", category: "Priority" },
    { text: "It's okay to take a break. Rest is not laziness.", category: "Rest" },
    { text: "You are not alone in this journey. Many others understand.", category: "Connection" },
  ];

  const mentalHealthTips = [
    { title: "Practice the 5-5-5 Rule", tip: "When overwhelmed: Take 5 deep breaths, name 5 things you can see, move 5 parts of your body.", icon: "🧘" },
    { title: "Create a 'Worry Time'", tip: "Set aside 15 minutes daily to worry. This helps contain anxiety.", icon: "⏰" },
    { title: "The 2-Minute Rule", tip: "If a task takes less than 2 minutes, do it now.", icon: "✅" },
    { title: "Phone-Free Mornings", tip: "Avoid checking your phone for the first 30 minutes after waking.", icon: "📱" },
    { title: "Micro-breaks Matter", tip: "Every 50 minutes of studying, take a 10-minute break.", icon: "🚶" },
    { title: "The 'Three Good Things' Practice", tip: "Before bed, write down 3 good things that happened today.", icon: "📝" },
    { title: "Social Media Boundaries", tip: "Unfollow accounts that make you feel worse about yourself.", icon: "🌐" },
    { title: "The 'Pause Button' Technique", tip: "When feeling intense emotions, count to 10 before responding.", icon: "⏸️" },
    { title: "Nature Therapy", tip: "Spend 20 minutes in nature daily. It reduces stress hormones.", icon: "🌳" },
    { title: "The 'Energy Audit'", tip: "List what drains vs. energizes you. Balance accordingly.", icon: "⚡" },
  ];

  useEffect(() => {
    getRandomAffirmation();
  }, []);

  const getRandomAffirmation = () => {
    const randomAff = affirmations[Math.floor(Math.random() * affirmations.length)];
    const randomTip = mentalHealthTips[Math.floor(Math.random() * mentalHealthTips.length)];
    setAffirmation({ affirmation: randomAff, tip: randomTip });
  };

  if (!affirmation) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg transition-colors duration-300">
      {/* Affirmation Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Daily Affirmation
          </h3>
        </div>
        <blockquote className="text-xl text-gray-700 dark:text-gray-300 italic mb-2">
          "{affirmation.affirmation.text}"
        </blockquote>
        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
          — {affirmation.affirmation.category}
        </p>
      </div>

      {/* Mental Health Tip Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm transition-colors duration-300">
        <div className="flex items-start gap-3">
          <span className="text-4xl">{affirmation.tip.icon}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              💡 Today's Tip: {affirmation.tip.title}
            </h4>
            <p className="text-gray-700 dark:text-gray-300">{affirmation.tip.tip}</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={getRandomAffirmation}
        icon={<RefreshCw size={16} />}
      >
        Get New Affirmation
      </Button>
    </div>
  );
};

export default DailyAffirmation;
