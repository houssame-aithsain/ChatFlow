import React, { useRef, useEffect } from 'react';
import { Message } from './Message';

export function ChatContainer({ messages, isTyping, setMessages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          content={message.content}
          timestamp={message.timestamp}
          isAI={message.isAI}
        />
      ))}
      {isTyping && (
        <div className="flex gap-2 items-center text-gray-500">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100" />
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
