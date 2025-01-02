import React from 'react';
import { User, Bot } from 'lucide-react';

export function Message({ content, timestamp, isAI }) {
  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <div className={`max-w-[70%] ${isAI ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-3 rounded-lg ${
            isAI
              ? 'bg-white border border-gray-200'
              : 'bg-blue-600 text-white'
          }`}
        >
          <p className="text-sm">{content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {timestamp.toLocaleTimeString()}
        </p>
      </div>
      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
