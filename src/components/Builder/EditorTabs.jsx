import React from 'react';
import { Code, Eye } from 'lucide-react';

export function EditorTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-800 px-4 py-2">
      <div className="flex space-x-4">
        <button
          onClick={() => onTabChange('code')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg ${
            activeTab === 'code'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>Code</span>
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg ${
            activeTab === 'preview'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}