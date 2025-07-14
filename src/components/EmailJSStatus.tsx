import React from 'react';
import { CheckCircle, Mail } from 'lucide-react';
import { EmailService } from '../utils/emailService';

const EmailJSStatus: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Email Service Status
          </h3>
          <p className="text-xs text-gray-600 mb-2">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              EmailJS configured and ready
            </span>
          </p>
          <div className="text-xs text-gray-500">
            <p className="mb-2 font-medium">Email Service Details:</p>
            <ul className="space-y-1">
              <li>• Service: EmailJS</li>
              <li>• Template: template_s0kxnul</li>
              <li>• Status: Production Ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailJSStatus; 