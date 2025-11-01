import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmergencyFAB = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/emergency')}
      className="fixed bottom-6 left-6 w-14 h-14 flex items-center justify-center 
                 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 
                 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                 text-white dark:from-red-700 dark:to-red-800 dark:hover:from-red-800 dark:hover:to-red-900
                 border border-red-500/40 hover:scale-110 focus:outline-none focus:ring-4 
                 focus:ring-red-300 dark:focus:ring-red-800 z-40"
      title="Need Help Now?"
      aria-label="Emergency Help"
    >
      <AlertTriangle size={26} className="animate-pulse" />
    </button>
  );
};

export default EmergencyFAB;
