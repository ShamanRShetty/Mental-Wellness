import React, { useState } from 'react';
import { ClipboardList, X } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';

const Assessment = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const assessments = {
    stress: {
      name: 'Stress Level Assessment',
      description: 'Evaluate your current stress levels',
      icon: '😰',
      questions: [
        {
          question: 'How often have you felt nervous or stressed in the past week?',
          options: [
            { text: 'Not at all', score: 0 },
            { text: 'Several days', score: 1 },
            { text: 'More than half the days', score: 2 },
            { text: 'Nearly every day', score: 3 },
          ],
        },
        {
          question: 'How often have you felt that you were unable to control important things?',
          options: [
            { text: 'Never', score: 0 },
            { text: 'Almost never', score: 1 },
            { text: 'Sometimes', score: 2 },
            { text: 'Fairly often', score: 3 },
            { text: 'Very often', score: 4 },
          ],
        },
        {
          question: 'How often have you felt difficulties were piling up so high you could not overcome them?',
          options: [
            { text: 'Never', score: 0 },
            { text: 'Almost never', score: 1 },
            { text: 'Sometimes', score: 2 },
            { text: 'Fairly often', score: 3 },
            { text: 'Very often', score: 4 },
          ],
        },
        {
          question: 'How often have you found yourself thinking about problems even when trying to focus on other things?',
          options: [
            { text: 'Rarely', score: 0 },
            { text: 'Sometimes', score: 1 },
            { text: 'Often', score: 2 },
            { text: 'Very often', score: 3 },
          ],
        },
        {
          question: 'How often have you had trouble sleeping because of worry?',
          options: [
            { text: 'Not at all', score: 0 },
            { text: 'A little', score: 1 },
            { text: 'Moderately', score: 2 },
            { text: 'A lot', score: 3 },
          ],
        },
      ],
      interpretation: [
        { min: 0, max: 5, level: 'Low', color: 'green', message: 'Your stress levels appear to be low. Keep up your self-care practices!' },
        { min: 6, max: 10, level: 'Moderate', color: 'yellow', message: 'You\'re experiencing moderate stress. Consider implementing stress-management techniques.' },
        { min: 11, max: 15, level: 'High', color: 'orange', message: 'Your stress levels are high. It may be helpful to talk to someone or seek support.' },
        { min: 16, max: 20, level: 'Very High', color: 'red', message: 'You\'re experiencing very high stress. Please consider reaching out to a mental health professional.' },
      ],
    },
    anxiety: {
      name: 'Anxiety Screening',
      description: 'Check your anxiety symptoms',
      icon: '😟',
      questions: [
        {
          question: 'Feeling nervous, anxious, or on edge',
          options: [
            { text: 'Not at all', score: 0 },
            { text: 'Several days', score: 1 },
            { text: 'More than half the days', score: 2 },
            { text: 'Nearly every day', score: 3 },
          ],
        },
        {
          question: 'Not being able to stop or control worrying',
          options: [
            { text: 'Not at all', score: 0 },
            { text: 'Several days', score: 1 },
            { text: 'More than half the days', score: 2 },
            { text: 'Nearly every day', score: 3 },
          ],
        },
        {
          question: 'Worrying too much about different things',
          options: [
            { text: 'Not at all', score: 0 },
            { text: 'Several days', score: 1 },
            { text: 'More than half the days', score: 2 },
            { text: 'Nearly every day', score: 3 },
          ],
        },
        {
          question: 'Trouble relaxing',
          options: [
            { text: 'Not at all', score: 0 },
            { text: 'Several days', score: 1 },
            { text: 'More than half the days', score: 2 },
            { text: 'Nearly every day', score: 3 },
          ],
        },
        {
          question: 'Being so restless that it\'s hard to sit still',
          options: [
            { text: 'Not at all', score: 0 },
            { text: 'Several days', score: 1 },
            { text: 'More than half the days', score: 2 },
            { text: 'Nearly every day', score: 3 },
          ],
        },
      ],
      interpretation: [
        { min: 0, max: 4, level: 'Minimal', color: 'green', message: 'Minimal anxiety symptoms. Continue your healthy habits!' },
        { min: 5, max: 9, level: 'Mild', color: 'yellow', message: 'Mild anxiety. Consider relaxation techniques and self-care.' },
        { min: 10, max: 14, level: 'Moderate', color: 'orange', message: 'Moderate anxiety. Talking to a counselor might be beneficial.' },
        { min: 15, max: 21, level: 'Severe', color: 'red', message: 'Severe anxiety symptoms. Please consider professional support.' },
      ],
    },
    burnout: {
      name: 'Burnout Assessment',
      description: 'Check if you\'re experiencing burnout',
      icon: '🔥',
      questions: [
        {
          question: 'I feel emotionally drained from my work/studies',
          options: [
            { text: 'Never', score: 0 },
            { text: 'Rarely', score: 1 },
            { text: 'Sometimes', score: 2 },
            { text: 'Often', score: 3 },
            { text: 'Always', score: 4 },
          ],
        },
        {
          question: 'I feel like I\'m just going through the motions',
          options: [
            { text: 'Never', score: 0 },
            { text: 'Rarely', score: 1 },
            { text: 'Sometimes', score: 2 },
            { text: 'Often', score: 3 },
            { text: 'Always', score: 4 },
          ],
        },
        {
          question: 'I feel tired even before I start my day',
          options: [
            { text: 'Never', score: 0 },
            { text: 'Rarely', score: 1 },
            { text: 'Sometimes', score: 2 },
            { text: 'Often', score: 3 },
            { text: 'Always', score: 4 },
          ],
        },
        {
          question: 'I have lost enthusiasm for my work/studies',
          options: [
            { text: 'Not at all', score: 0 },
            { text: 'A little', score: 1 },
            { text: 'Moderately', score: 2 },
            { text: 'Quite a bit', score: 3 },
            { text: 'Extremely', score: 4 },
          ],
        },
        {
          question: 'I feel disconnected from my goals and values',
          options: [
            { text: 'Never', score: 0 },
            { text: 'Rarely', score: 1 },
            { text: 'Sometimes', score: 2 },
            { text: 'Often', score: 3 },
            { text: 'Always', score: 4 },
          ],
        },
      ],
      interpretation: [
        { min: 0, max: 6, level: 'Low Risk', color: 'green', message: 'Low risk of burnout. Keep maintaining work-life balance!' },
        { min: 7, max: 12, level: 'Moderate Risk', color: 'yellow', message: 'Some signs of burnout. Take time for self-care and rest.' },
        { min: 13, max: 17, level: 'High Risk', color: 'orange', message: 'High burnout risk. Consider setting boundaries and seeking support.' },
        { min: 18, max: 25, level: 'Severe Burnout', color: 'red', message: 'Severe burnout symptoms. Please take action and seek professional guidance.' },
      ],
    },
  };

  const startAssessment = (type) => {
    setSelectedAssessment(type);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    const assessment = assessments[selectedAssessment];

    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      const interpretation = assessment.interpretation.find(
        (i) => totalScore >= i.min && totalScore <= i.max
      );
      setResult({ score: totalScore, ...interpretation });
    }
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  // ---------- MAIN UI BELOW ----------

  if (!selectedAssessment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8 transition-colors">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
              <ClipboardList className="text-blue-600 dark:text-blue-400" size={40} />
              Self-Assessment Tools
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Quick screenings to help you understand your mental wellness
            </p>
          </div>

          <Alert
            type="info"
            title="Important Note"
            message="These assessments are for self-reflection only and are not a substitute for professional diagnosis. If you're concerned about your mental health, please consult a healthcare professional."
          />

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {Object.entries(assessments).map(([key, assessment]) => (
              <Card
                key={key}
                hover
                onClick={() => startAssessment(key)}
                className="dark:bg-dark-card dark:text-dark-text"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{assessment.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {assessment.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{assessment.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {assessment.questions.length} questions • 2-3 min
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const assessment = assessments[selectedAssessment];

  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300',
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8 transition-colors">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="dark:bg-dark-card dark:text-dark-text">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{assessment.icon}</div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Assessment Complete
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{assessment.name}</p>
            </div>

            <div className={`border-2 rounded-xl p-6 mb-6 ${colorClasses[result.color]}`}>
              <div className="text-center mb-4">
                <p className="text-sm font-medium mb-2">Your Score</p>
                <p className="text-5xl font-bold mb-2">{result.score}</p>
                <p className="text-xl font-semibold">{result.level}</p>
              </div>
              <p className="text-center">{result.message}</p>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <Button onClick={resetAssessment}>Take Another Assessment</Button>
              <Button variant="outline" onClick={() => (window.location.href = '/resources')}>
                View Resources
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8 transition-colors">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="dark:bg-dark-card dark:text-dark-text">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {assessment.name}
              </h2>
              <button
                onClick={resetAssessment}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left px-6 py-4 bg-white dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition transform hover:scale-[1.02]"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          {currentQuestion > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1);
                setAnswers(answers.slice(0, -1));
              }}
            >
              ← Previous Question
            </Button>
          )}
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is a screening tool, not a diagnosis. Results should be discussed with a healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
