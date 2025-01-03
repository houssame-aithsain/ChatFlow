import { ChatContainer } from '../chat/ChatContainer'
import { MessageInput } from '../chat/MessageInput';
import Sidebar from '../components/sidebar/Sidebar';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../auth/AuthProvider';

async function callSocket(token, user_message) {
    return new Promise((resolve, reject) => {
        const socketUrl = `ws://127.0.0.1:8443/ws/chat/?token=${token.token}`;
        const socket = new WebSocket(socketUrl);

        socket.onopen = function () {
            const message = {
                type: "chat_message",
                message: user_message,
            };
            socket.send(JSON.stringify(message));
        };

        socket.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data);
                console.log("Message from server: ", data.ai_response);
                resolve(data.ai_response);
            } catch (error) {
                reject(error);
            }
        };

        socket.onerror = function (error) {
            reject(error);
        };

        socket.onclose = function () {
            console.log("WebSocket connection closed.");
        };
    });
}


function ChatBar() {
    const token = useAuth();
    const [messages, setMessages] = useState([]); // tomorrows i need to start from here
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
        const aiResponse = async () => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: await callSocket(token, userMessage.content),
                timestamp: new Date(),
                isAI: true,
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        };
        await aiResponse();
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
                    <div className="flex-1 overflow-hidden overflow-y-auto">
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
