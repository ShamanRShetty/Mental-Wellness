import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceInput = ({ onTranscript, disabled = false }) => {
  const [isSupported, setIsSupported] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en-IN');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Supported languages
  const languages = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी' },
    { code: 'ta-IN', name: 'தமிழ்' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ' },
    { code: 'te-IN', name: 'తెలుగు' },
    { code: 'ml-IN', name: 'മലയാളം' },
  ];

  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    setIsSupported(browserSupportsSpeechRecognition);
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: false,
      language: languages[langIndex].code,
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const cycleLanguage = (e) => {
    e.stopPropagation();
    const nextIndex = (langIndex + 1) % languages.length;
    setLangIndex(nextIndex);
    setCurrentLanguage(languages[nextIndex].code);
  };

  if (!isSupported) {
    return (
      <div className="text-xs text-gray-500 dark:text-dark-muted text-center py-2">
        Voice input not supported in this browser
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="text-xs text-orange-600 dark:text-orange-400 text-center py-2">
        Microphone access denied
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      
      {/* Microphone Button */}
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        disabled={disabled}
        className={`p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          listening
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        title={
          listening
            ? 'Stop recording'
            : `Start voice input (${languages[langIndex].name})`
        }
      >
        {listening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
    </div>
  );
};

export default VoiceInput;
