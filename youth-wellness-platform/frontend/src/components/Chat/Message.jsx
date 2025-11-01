import React from 'react';
import { Bot, User } from 'lucide-react';
import { formatTime } from '../../utils/helpers';

const Message = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-purple-600'
        }`}
      >
        {isUser ? (
          <User className="text-white" size={20} />
        ) : (
          <Bot className="text-white" size={20} />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block max-w-[80%] px-4 py-3 rounded-lg transition-colors duration-200 ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-800 rounded-tl-none dark:bg-gray-800 dark:text-gray-100'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default Message;
