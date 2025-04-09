import React from 'react';
import { Code2 } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code2 className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-white">SOEN</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="text-gray-300 hover:text-blue-500 transition-colors">Home</a></li>
              <li><a href="/templates" className="text-gray-300 hover:text-blue-500 transition-colors">Templates</a></li>
              <li><a href="/docs" className="text-gray-300 hover:text-blue-500 transition-colors">Docs</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}