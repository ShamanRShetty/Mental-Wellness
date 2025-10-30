import React from 'react';
import { ExternalLink, ThumbsUp, Clock, Tag } from 'lucide-react';
import Button from '../UI/Button';
import { markResourceHelpful } from '../../services/api';

const ResourceCard = ({ resource, onMarkHelpful }) => {
  const categoryColors = {
    helpline: 'bg-red-100 text-red-700',
    article: 'bg-blue-100 text-blue-700',
    video: 'bg-purple-100 text-purple-700',
    exercise: 'bg-green-100 text-green-700',
    meditation: 'bg-indigo-100 text-indigo-700',
    emergency: 'bg-red-100 text-red-700',
  };

  const handleMarkHelpful = async () => {
    try {
      await markResourceHelpful(resource._id);
      onMarkHelpful(resource._id);
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            categoryColors[resource.category] || 'bg-gray-100 text-gray-700'
          }`}
        >
          {resource.category.toUpperCase()}
        </span>
        {resource.isEmergency && (
          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold animate-pulse">
            EMERGENCY
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {resource.title}
      </h3>
      <p className="text-gray-600 mb-4">{resource.description}</p>

      {resource.content && (
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-4 whitespace-pre-wrap">
          {resource.content}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags && resource.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs flex items-center gap-1"
          >
            <Tag size={12} />
            {tag}
          </span>
        ))}
      </div>

      {resource.duration && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock size={16} />
          <span>{resource.duration} minutes</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={handleMarkHelpful}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ThumbsUp size={18} />
          <span className="text-sm">{resource.helpful || 0} helpful</span>
        </button>

        {resource.url && (
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">
              <ExternalLink size={16} className="mr-2" />
              View
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;