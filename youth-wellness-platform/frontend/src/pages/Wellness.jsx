import React, { useState, useEffect } from 'react';
import { Wind, Smile, Brain, Heart } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import BreathingExercise from '../components/Wellness/BreathingExercise';

// ✅ Grounding Exercise
const GroundingExercise = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { sense: '5 things you can SEE', prompt: 'Look around and name 5 things you can see' },
    { sense: '4 things you can TOUCH', prompt: 'Notice 4 things you can physically feel' },
    { sense: '3 things you can HEAR', prompt: 'Listen for 3 sounds around you' },
    { sense: '2 things you can SMELL', prompt: 'Identify 2 scents in your environment' },
    { sense: '1 thing you can TASTE', prompt: 'Notice 1 thing you can taste' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        5-4-3-2-1 Grounding Technique
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        This technique helps you stay present and calm during moments of anxiety or stress.
      </p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {step + 1} / {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Display */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 mb-6 text-center">
        <div className="text-6xl mb-6">
          {['👀', '✋', '👂', '👃', '👅'][step]}
        </div>
        <h4 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {steps[step].sense}
        </h4>
        <p className="text-lg text-gray-700 dark:text-gray-300">{steps[step].prompt}</p>
      </div>

      <div className="flex gap-4 justify-center">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Previous</Button>}
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)}>Next</Button>
        ) : (
          <Button variant="success" onClick={() => setStep(0)}>Start Again</Button>
        )}
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tip:</strong> Take your time with each step. There's no rush — this works best slowly and mindfully.
        </p>
      </div>
    </div>
  );
};

// ✅ Relaxation Exercise
const RelaxationExercise = () => {
  const [currentMuscle, setCurrentMuscle] = useState(0);
  const muscleGroups = [
    { name: 'Hands', instruction: 'Make tight fists, then release' },
    { name: 'Arms', instruction: 'Tense your biceps, then relax' },
    { name: 'Shoulders', instruction: 'Raise shoulders to ears, then drop' },
    { name: 'Face', instruction: 'Scrunch your face, then release' },
    { name: 'Chest', instruction: 'Take deep breath and hold, then exhale' },
    { name: 'Stomach', instruction: 'Tighten abs, then release' },
    { name: 'Legs', instruction: 'Tense thigh muscles, then relax' },
    { name: 'Feet', instruction: 'Curl toes tightly, then release' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Progressive Muscle Relaxation
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Systematically tense and relax different muscle groups to release physical tension.
      </p>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 mb-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧘‍♀️</div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {muscleGroups[currentMuscle].name}
          </h4>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {muscleGroups[currentMuscle].instruction}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {muscleGroups.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentMuscle
                  ? 'bg-purple-600 dark:bg-purple-400'
                  : index < currentMuscle
                  ? 'bg-purple-300 dark:bg-purple-500/50'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          {currentMuscle > 0 && (
            <Button variant="outline" onClick={() => setCurrentMuscle(currentMuscle - 1)}>
              Previous
            </Button>
          )}
          {currentMuscle < muscleGroups.length - 1 ? (
            <Button onClick={() => setCurrentMuscle(currentMuscle + 1)}>Next Group</Button>
          ) : (
            <Button variant="success" onClick={() => setCurrentMuscle(0)}>Complete!</Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Mindfulness Exercise
const MindfulnessExercise = () => {
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && timer > 0) interval = setInterval(() => setTimer((t) => t - 1), 1000);
    else if (timer === 0) setIsActive(false);
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startTimer = (seconds) => {
    setTimer(seconds);
    setIsActive(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Mindfulness Meditation
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Take a few minutes to be present and aware of your thoughts and feelings.
      </p>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-12 mb-8 text-center">
        <div className="text-8xl mb-8">🧘</div>
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </div>

        {!isActive ? (
          <div className="flex gap-4 justify-center flex-wrap">
            {[60, 180, 300, 600].map((t, i) => (
              <Button key={i} onClick={() => startTimer(t)}>
                {t / 60} Minute{t > 60 ? 's' : ''}
              </Button>
            ))}
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setIsActive(false)}>Pause</Button>
        )}
      </div>
    </div>
  );
};

// ✅ Main Wellness Page
const Wellness = () => {
  const [activeTab, setActiveTab] = useState('breathing');
  const tabs = [
    { id: 'breathing', name: 'Breathing', icon: Wind },
    { id: 'grounding', name: 'Grounding', icon: Brain },
    { id: 'relaxation', name: 'Relaxation', icon: Heart },
    { id: 'mindfulness', name: 'Mindfulness', icon: Smile },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Wellness Exercises
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive exercises to help you relax and manage stress
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                {tab.name}
              </button>
            );
          })}
        </div>

        <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
          {activeTab === 'breathing' && <BreathingExercise />}
          {activeTab === 'grounding' && <GroundingExercise />}
          {activeTab === 'relaxation' && <RelaxationExercise />}
          {activeTab === 'mindfulness' && <MindfulnessExercise />}
        </Card>
      </div>
    </div>
  );
};

export default Wellness;
