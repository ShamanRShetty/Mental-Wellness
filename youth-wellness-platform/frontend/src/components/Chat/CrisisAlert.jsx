import React from 'react';
import { AlertTriangle, Phone, ExternalLink } from 'lucide-react';
import Button from '../UI/Button';

const CrisisAlert = ({ crisisData, onClose }) => {
  return (
    <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 mb-4 transition-colors duration-300">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            We're Here for You
          </h3>
          <p className="text-red-700 dark:text-red-400 mb-4">{crisisData.message}</p>

          {/* Emergency Helplines */}
          {crisisData.helplines && (
            <div className="space-y-3">
              <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm">
                Emergency Helplines (24/7):
              </h4>
              {crisisData.helplines.map((helpline, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-red-200 dark:border-red-800 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 dark:text-gray-100">
                        {helpline.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {helpline.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {helpline.hours}
                      </p>
                    </div>

                    <a
                      href={`tel:${helpline.number.replace(/[^0-9]/g, '')}`}
                      className="ml-4"
                    >
                      <Button size="sm" variant="danger">
                        <Phone size={16} className="mr-2" />
                        Call Now
                      </Button>
                    </a>
                  </div>

                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {helpline.number}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Urgent Actions */}
          {crisisData.urgentActions && (
            <div className="mt-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-red-200 dark:border-red-800 transition-colors duration-300">
              <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm mb-2">
                Immediate Steps:
              </h4>
              <ul className="space-y-2">
                {crisisData.urgentActions.map((action, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-200 flex items-start">
                    <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => window.open('/resources?category=helpline', '_blank')}
            >
              <ExternalLink size={16} className="mr-2" />
              More Resources
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              I Understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisAlert;
