import React, { useState } from 'react';

const ChatList = () => {
  const [conv, setConv] = useState([]);

  const AddChat = () => {
    setConv([...conv, { id: conv.length + 1, name: `Chat ${conv.length + 1}` }]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={AddChat} // Handle click here
          className="text-sm px-16 py-2 rounded-md bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] hover:opacity-90 transition-opacity"
        >
          New Chat
        </button>
      </div>
      <div className="space-y-2">
        {
          conv.map((chat) => (
            <div
              key={chat.id}
              className="p-3 rounded-lg cursor-pointer transition-all duration-300 group hover:bg-gradient-to-r hover:from-[#FF4B2B]/10 hover:to-[#FF416C]/10 border border-transparent hover:border-[#FF416C]/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF4B2B]/20 to-[#FF416C]/20 flex items-center justify-center">
                    <span className="text-sm">{chat.id}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{chat.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ChatList;
