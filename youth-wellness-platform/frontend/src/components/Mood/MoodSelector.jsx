import React from 'react';
import { getMoodEmoji, getMoodLabel } from '../../utils/helpers';

const moods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];

const MoodSelector = ({ selectedMood, onSelect }) => {
  const handleSelect = (mood) => {
    onSelect(mood);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* First row: 3 moods */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {moods.slice(0, 3).map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => handleSelect(mood)}
            className={`flex flex-col items-center justify-between
                        w-16 sm:w-20 h-20 sm:h-24 
                        p-3 sm:p-4 rounded-xl border-2
                        transition-all duration-200 hover:scale-[1.03]
                        ${
                          selectedMood === mood
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400 scale-105'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                        }`}
          >
            <span className="text-3xl sm:text-4xl">{getMoodEmoji(mood)}</span>
            <span className="text-[11px] sm:text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight text-center">
              {getMoodLabel(mood)}
            </span>
          </button>
        ))}
      </div>

      {/* Second row: 2 moods centered */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 justify-center">
        {moods.slice(3).map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => handleSelect(mood)}
            className={`flex flex-col items-center justify-between
                        w-16 sm:w-20 h-20 sm:h-24 
                        p-3 sm:p-4 rounded-xl border-2
                        transition-all duration-200 hover:scale-[1.03]
                        ${
                          selectedMood === mood
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400 scale-105'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                        }`}
          >
            <span className="text-3xl sm:text-4xl">{getMoodEmoji(mood)}</span>
            <span className="text-[11px] sm:text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight text-center">
              {getMoodLabel(mood)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
