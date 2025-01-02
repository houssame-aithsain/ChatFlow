import { ChatContainer } from '../chat/ChatContainer'
import { MessageInput } from '../chat//MessageInput';
import Sidebar from '../components/sidebar/Sidebar';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function ChatBar() {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const handleSendMessage = async (content, files) => {
        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            content,
            timestamp: new Date(),
            isAI: false,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Simulate AI response
        setIsTyping(true);
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: `Response to: ${content}`,
                timestamp: new Date(),
                isAI: true,
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-900 h-screen bg-gray-800 text-white">
            <div className="fixed inset-0 flex flex-col bg-gray-100">
                <main className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-hidden">
                        <ChatContainer messages={messages} isTyping={isTyping} />
                    </div>
                    <div className="mt-auto">
                        <MessageInput onSendMessage={handleSendMessage} isLoading={isTyping} />
                    </div>
                </main>
            </div>
        </div>
    );
}


function Home() {

    return (
        <>
            <Sidebar />
            <ChatBar />
        </>
    );
}

export default Home;
