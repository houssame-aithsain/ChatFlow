import React, { useState } from 'react';

const ModelSwitcher = () => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-3.5');
  
  const models = ['GPT-3.5', 'GPT-4', 'Claude', 'LLAMA'];

  return (
    <div className="p-4">
      <div 
        className="flex items-center justify-between cursor-pointer p-3 rounded-lg bg-gradient-to-r from-[#FF4B2B]/10 to-[#FF416C]/10 hover:from-[#FF4B2B]/20 hover:to-[#FF416C]/20 transition-all duration-300 border border-[#FF416C]/20"
        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF4B2B] to-[#FF416C]"></div>
          <span className="text-gray-100">{selectedModel}</span>
        </div>
        <span className={`transform transition-transform duration-300 ${isModelDropdownOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>
      
      {isModelDropdownOpen && (
        <div className="mt-2 rounded-lg border border-[#FF416C]/20 backdrop-blur-sm bg-gray-900/50 overflow-hidden">
          {models.map((model) => (
            <div
              key={model}
              className="p-3 hover:bg-gradient-to-r hover:from-[#FF4B2B]/20 hover:to-[#FF416C]/20 cursor-pointer transition-all duration-300 flex items-center space-x-2"
              onClick={() => {
                setSelectedModel(model);
                setIsModelDropdownOpen(false);
              }}
            >
              <div className={`w-2 h-2 rounded-full ${model === selectedModel ? 'bg-gradient-to-r from-[#FF4B2B] to-[#FF416C]' : 'bg-gray-600'}`}></div>
              <span>{model}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSwitcher;