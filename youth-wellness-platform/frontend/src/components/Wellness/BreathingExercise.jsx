import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Button from '../UI/Button';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState('478');

  const exercises = {
    '478': {
      name: '4-7-8 Breathing',
      description: 'Calming technique to reduce anxiety',
      inhale: 4,
      hold: 7,
      exhale: 8,
    },
    box: {
      name: 'Box Breathing',
      description: 'Used by Navy SEALs for focus',
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4,
    },
    calm: {
      name: 'Calm Breathing',
      description: 'Simple relaxation technique',
      inhale: 4,
      hold: 2,
      exhale: 6,
    },
  };

  const currentExercise = exercises[selectedExercise];

  useEffect(() => {
    let interval;

    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isActive && countdown === 0) {
      switch (phase) {
        case 'ready':
          setPhase('inhale');
          setCountdown(currentExercise.inhale);
          break;
        case 'inhale':
          setPhase('hold');
          setCountdown(currentExercise.hold);
          break;
        case 'hold':
          setPhase('exhale');
          setCountdown(currentExercise.exhale);
          break;
        case 'exhale':
          if (currentExercise.holdAfterExhale) {
            setPhase('holdAfterExhale');
            setCountdown(currentExercise.holdAfterExhale);
          } else {
            setCycles((prev) => prev + 1);
            setPhase('inhale');
            setCountdown(currentExercise.inhale);
          }
          break;
        case 'holdAfterExhale':
          setCycles((prev) => prev + 1);
          setPhase('inhale');
          setCountdown(currentExercise.inhale);
          break;
        default:
          break;
      }
    }

    return () => clearInterval(interval);
  }, [isActive, countdown, phase, currentExercise, selectedExercise]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCountdown(currentExercise.inhale);
    setCycles(0);
  };

  const pauseExercise = () => setIsActive(false);

  const resetExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCountdown(0);
    setCycles(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'ready':
        return 'Ready to begin';
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdAfterExhale':
        return 'Hold';
      default:
        return '';
    }
  };

  const getCircleSize = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'exhale') return 'scale-75';
    return 'scale-100';
  };

  return (
    <div className="max-w-2xl mx-auto transition-colors duration-300">
      {/* Exercise Selector */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">
          Choose a breathing exercise:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(exercises).map(([key, exercise]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedExercise(key);
                resetExercise();
              }}
              className={`p-4 rounded-lg border-2 transition text-left ${
                selectedExercise === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                  : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-muted bg-white dark:bg-dark-card'
              }`}
            >
              <h4 className="font-semibold text-gray-800 dark:text-dark-text mb-1">
                {exercise.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-dark-muted">
                {exercise.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Breathing Circle */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-dark-bg dark:to-dark-card rounded-2xl p-12 mb-8 transition-colors duration-300">
        <div className="flex flex-col items-center">
          {/* Animated Circle */}
          <div className="relative mb-8">
            <div
              className={`w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transition-transform duration-1000 ease-in-out ${getCircleSize()} flex items-center justify-center shadow-2xl`}
            >
              <div className="text-center text-white">
                <p className="text-3xl font-bold mb-2">{countdown}</p>
                <p className="text-xl">{getPhaseText()}</p>
              </div>
            </div>
          </div>

          {/* Cycles Counter */}
          <p className="text-lg text-gray-700 dark:text-dark-text mb-6">
            Completed Cycles:{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {cycles}
            </span>
          </p>

          {/* Controls */}
          <div className="flex gap-4">
            {!isActive ? (
              <Button size="lg" onClick={startExercise} icon={<Play size={20} />}>
                Start
              </Button>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                onClick={pauseExercise}
                icon={<Pause size={20} />}
              >
                Pause
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={resetExercise}
              icon={<RotateCcw size={20} />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 transition-colors duration-300">
        <h4 className="font-semibold text-gray-800 dark:text-dark-text mb-3">
          How it works:
        </h4>
        <ul className="space-y-2 text-gray-700 dark:text-dark-muted">
          <li className="flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-2">1.</span>
            <span>Find a comfortable seated position</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-2">2.</span>
            <span>Close your eyes or soften your gaze</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-2">3.</span>
            <span>Follow the circle and instructions</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-2">4.</span>
            <span>Complete 4-5 cycles for best results</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BreathingExercise;
