import React, { useState, useRef } from 'react';
import { Send, Paperclip, Loader } from 'lucide-react';
import { AuthProvider, useAuth } from '../auth/AuthProvider';

export function MessageInput({ messageLength, onSendMessage, isLoading }) {
  const token = useAuth();
  let [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = /^(image\/(jpeg|png|gif)|application\/(pdf|msword)|text\/plain)$/i.test(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });
    setFiles(validFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="flex bg-gray-300 gap-2 p-4 border-t border-gray-200">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 bg-gray-300 hover:bg-gray-500 rounded-full hover:bg-gray-100"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border text-black hover:text-slate-400 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || (!message.trim() && !files.length)}
          className="p-2 bg-gray-300 text-white rounded-full hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}
