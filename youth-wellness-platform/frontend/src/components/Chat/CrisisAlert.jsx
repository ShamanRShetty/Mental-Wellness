import React from 'react';
import { AlertTriangle, Phone, ExternalLink } from 'lucide-react';
import Button from '../UI/Button';

const CrisisAlert = ({ crisisData, onClose }) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            We're Here for You
          </h3>
          <p className="text-red-700 mb-4">{crisisData.message}</p>

          {/* Emergency Helplines */}
          {crisisData.helplines && (
  <div className="space-y-3">
    <h4 className="font-semibold text-red-800 text-sm">
      Emergency Helplines (24/7):
    </h4>
    {crisisData.helplines.map((helpline, index) => (
      <div
        key={index}
        className="bg-white rounded-lg p-4 border border-red-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h5 className="font-semibold text-gray-800">
              {helpline.name}
            </h5>
            <p className="text-sm text-gray-600 mt-1">
              {helpline.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {helpline.hours}
            </p>
          </div>

          {/* ✅ FIXED ANCHOR TAG */}
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

        <p className="text-lg font-bold text-blue-600 mt-2">
          {helpline.number}
        </p>
      </div>
    ))}
  </div>
)}


          {/* Urgent Actions */}
          {crisisData.urgentActions && (
            <div className="mt-4 bg-white rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-800 text-sm mb-2">
                Immediate Steps:
              </h4>
              <ul className="space-y-2">
                {crisisData.urgentActions.map((action, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-red-600 mr-2">•</span>
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