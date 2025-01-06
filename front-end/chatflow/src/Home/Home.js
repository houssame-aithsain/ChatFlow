import { ChatContainer } from '../chat/ChatContainer'
import { MessageInput } from '../chat/MessageInput';
import { AuthProvider, useAuth } from '../auth/AuthProvider';
import React, { useEffect, useState } from 'react';
import ModelSwitcher from '../components/sidebar/ModelSwitcher';
import Profile from '../components/sidebar/Profile';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

var socket = null;
var currentSession = -1

export function convTitle(message) {
    if (message && message.length > 0) {
        convTitle.staticVariable = message;
    }

    return convTitle.staticVariable;
}

export const AddChatHistory = (setMessages, history) => {
    if (socket !== null) {
        socket.close();
        console.log("------->Socket closed<-------");
    }
    currentSession = -1;
    setMessages([]);
    history.push('/home');
};

export const getUserCchatHistory = async (token, id) => {
    if (id === 0) {
        const response = await fetch(`http://localhost:8443/c/sessions/chatsession/?token=${token.token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    } else {
        const response = await fetch(`http://localhost:8443/c/sessions/chatsession/?token=${token.token}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
            credentials: 'include',
        });
        return response.json();
    };
};

const ChatList = ({ token, conv, setConv, messages, setMessages }) => {
    const history = useHistory();
    useEffect(() => {
        const fetchChatHistory = async () => {
            const chats = await getUserCchatHistory(token, 0);
            // console.log(chats);
            if (chats.length > 0) {
                setConv(prevConv => [
                    ...prevConv,
                    ...chats.map(chat => ({
                        id: chat.id,
                        name: chat.messages[0] ? (chat.messages[0].user_message.length > 26 ? chat.messages[0].user_message.substring(0, 23) + "..." : chat.messages[0].user_message) : "No input",
                    }))
                ]);
            }
        };

        fetchChatHistory();
    }, [token, setConv]);

    const RenderChatHistory = (id) => {
        currentSession = id;
        const fetchChatHistory = async (id) => {
            setMessages([]);
            const chats = await getUserCchatHistory(token, id);
            const newMessages = [];
            chats.messages.forEach((message) => {
                // User message
                newMessages.push({
                    id: message.id,
                    content: message.user_message,
                    timestamp: new Date(message.timestamp),
                    isAI: false,
                });

                // AI response
                newMessages.push({
                    id: `${message.id}-ai`, // Ensure unique ID for AI message
                    content: message.ai_response,
                    timestamp: new Date(message.timestamp),
                    isAI: true,
                });
            });
            setMessages((prev) => [...prev, ...newMessages]);
        }
        fetchChatHistory(id);
    };

    const RemoveChatHistory = (id) => {
        const fetchChatHistory = async (id) => {
            const response = await fetch(`http://localhost:8443/c/sessions/remove/?token=${token.token}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id }),
                credentials: 'include',
            });
            try {
                if (response.ok) {
                    const data = await response.json();
                    conv.splice(conv.findIndex(chat => chat.id === id), 1);
                    setConv([...conv]);
                    if (currentSession === id) {
                        setMessages([]);
                        if (socket !== null) {
                            socket.close();
                        }
                        console.log(data, id);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchChatHistory(id);
    };
    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={() => AddChatHistory(setMessages, history)} // Handle click here
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
                            className="bg-slate-800 p-3 rounded-lg cursor-pointer transition-all duration-300 group hover:bg-gradient-to-r hover:from-[#FF4B2B]/10 hover:to-[#FF416C]/10 border border-transparent hover:border-[#FF416C]/20 relative"
                            onClick={(e) => { e.preventDefault(); RenderChatHistory(chat.id); }}
                        >
                            <button onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // Prevent event bubbling
                                RemoveChatHistory(chat.id);
                            }} className="absolute top-2 right-2 bg-slate-800 px-1 py-0.5 text-xs font-bold text-white rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                x
                            </button>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">

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

const Sidebar = ({ token, conv, setConv, messages, setMessages }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Handle window resize and set mobile state
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth <= 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Hamburger Menu Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden fixed top-4 ${isOpen ? 'left-[240px]' : 'left-4'} z-50 p-2 rounded-lg bg-gray-900 text-white transition-all duration-300`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Overlay for mobile when sidebar is open */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-gray-800 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
            >
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] flex items-center justify-center">
                            <span className="font-bold text-white">AI</span>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-transparent bg-clip-text">
                            ChatFlow
                        </h1>
                    </div>
                </div>

                <ModelSwitcher />
                <ChatList conv={conv} setConv={setConv} token={token} messages={messages} setMessages={setMessages} />
                <Profile />
            </div>
        </>
    );
};


async function callSocket(token, user_message, history, { conv, setConv }) {
    return new Promise((resolve, reject) => {
        const socketUrl = `ws://127.0.0.1:8443/ws/chat/?token=${token.token}`;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            if (socket) {
                socket.close(); // Close the previous socket if it's not open
            }
            socket = new WebSocket(socketUrl);

            socket.onopen = function () {
                const message = {
                    type: "chat_message",
                    message: user_message,
                    id: currentSession,
                };
                socket.send(JSON.stringify(message));
            };

            socket.onmessage = function (event) {
                try {
                    const data = JSON.parse(event.data);
                    console.log("Message from server: ", data.ai_response);
                    if (!conv.find(chat => chat.id === data.id))
                        setConv([...conv, { id: data.id, name: convTitle(user_message ? (user_message.length > 26 ? user_message.substring(0, 23) + "..." : user_message) : "No input",) }]);
                        currentSession = data.id;
                    resolve(data.ai_response);
                } catch (error) {
                    reject(error);
                }
            };

            socket.onerror = function (error) {
                // history.push('/home');
                reject(error);
            };

            socket.onclose = function () {
                // history.push('/home');
                console.log("WebSocket connection closed.");
            };
        } else {
            // If socket is open, send message
            const message = {
                type: "chat_message",
                message: user_message,
                id: currentSession,
            };
            socket.send(JSON.stringify(message));
        }

        // Always listen for the response, whether the socket is reused or newly created
        socket.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data);
                console.log("Message from server: ", data.ai_response);
                if (!conv.find(chat => chat.id === data.id))
                    setConv([...conv, { id: data.id, name: convTitle(user_message ? (user_message.length > 26 ? user_message.substring(0, 23) + "..." : user_message) : "No input",) }]);
                    currentSession = data.id;
                resolve(data.ai_response);
            } catch (error) {
                reject(error);
            }
        };

        socket.onerror = function (error) {
            // history.push('/home');
            reject(error);
        };

        socket.onclose = function () {
            // history.push('/home');
            console.log("WebSocket connection closed.");
        };
    });
}

function ChatBar({ token, conv, setConv, messages, setMessages }) {
    const [isTyping, setIsTyping] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const history = useHistory();
    const handleSendMessage = async (content, files) => {
        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            content,
            timestamp: new Date(),
            isAI: false,
        };
        setMessages((prev) => [...prev, userMessage]);
        convTitle(userMessage.content);

        // Simulate AI response
        setIsTyping(true);
        const aiResponse = async () => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: await callSocket(token, userMessage.content, history, { conv, setConv }),
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
                        <ChatContainer messages={messages} isTyping={isTyping} setMessages={setMessages} />
                    </div>
                    <div className="mt-auto h-24">
                        <MessageInput onSendMessage={handleSendMessage} isLoading={isTyping} />
                    </div>
                </main>
            </div>
        </div>
    );
}

function Home() {
    const [messages, setMessages] = useState([]); // tomorrows i need to start from here
    const [conv, setConv] = useState([]);
    const token = useAuth();

    return (
        <>
            <Sidebar conv={conv} setConv={setConv} token={token} messages={messages} setMessages={setMessages} />
            <ChatBar conv={conv} setConv={setConv} token={token} messages={messages} setMessages={setMessages} />
        </>
    );
}

export default Home;
