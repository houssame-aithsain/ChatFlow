import React, { useState, useEffect } from 'react';

const ModelSwitcher = ({ token, socket, setMessages, history }) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem('CURRENT_MODEL') || 'GEMMA2 | GOOGLE'
  );

  const models = ['GEMMA2 | GOOGLE', 'LLAMA3 | META', 'MIXTRAL | MISTRAL', 'LLAMA3-8B | META'];
  const models_id = ['gemma2-9b-it', 'llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama3-8b-8192'];

  useEffect(() => {
    localStorage.setItem('CURRENT_MODEL', selectedModel);
  }, [selectedModel]);

  const chnageModel = async (model) => {
    console.log(model);
    const response = await fetch(`http://localhost:8443/c/sessions/switch-model/?token=${token.token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model_id: model }),
    });
    const data = await response.json();
  };

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
          {models.map((model, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gradient-to-r hover:from-[#FF4B2B]/20 hover:to-[#FF416C]/20 cursor-pointer transition-all duration-300 flex items-center space-x-2"
              onClick={() => {
                setSelectedModel(model);
                setIsModelDropdownOpen(false);
                if (socket) socket.close();
                history.push('/home');
                chnageModel(models_id[index]);
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
