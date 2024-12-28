import React from 'react';

const ChatList = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <button className="text-sm px-16 py-2 rounded-md bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] hover:opacity-90 transition-opacity">
          New Chat
        </button>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((chat) => (
          <div 
            key={chat}
            className="p-3 rounded-lg cursor-pointer transition-all duration-300 group hover:bg-gradient-to-r hover:from-[#FF4B2B]/10 hover:to-[#FF416C]/10 border border-transparent hover:border-[#FF416C]/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF4B2B]/20 to-[#FF416C]/20 flex items-center justify-center">
                  <span className="text-sm">#{chat}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Chat subjetct ............. {chat}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;