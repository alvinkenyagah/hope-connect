import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Import the Socket.IO client library
import { io } from 'socket.io-client'; 
import { Send, ArrowLeft, MoreVertical, CheckCheck } from 'lucide-react';

export default function ChatPage({ currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Ensure we get the user data passed via navigation state
  const { otherUser } = location.state || {};
  
  // Change ws to be used for the Socket.IO connection object
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = currentUser?._id || currentUser?.id;

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentUser || !otherUser || !otherUser._id) {
      console.error("Missing user data for chat. Redirecting to dashboard.");
      // Use setTimeout to avoid side-effects during render phase
      setTimeout(() => navigate('/dashboard'), 0);
      return;
    }

    // Use http:// for the Socket.IO connection endpoint
    const socketUrl = 'http://localhost:4000';
    
    // 1. Initialize Socket.IO connection
    // We explicitly set the transport to 'websocket' for better performance if possible
    socketRef.current = io(socketUrl, { transports: ['websocket', 'polling'] });

    const socket = socketRef.current;

    // --- Socket.IO Event Listeners ---

    // 2. Handle successful connection (replaces ws.current.onopen)
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected (ID:', socket.id + ')');
      setIsConnected(true);
      
      // Emit the 'join' event to the server to join the private room
      socket.emit('join', userId); 

      // Fetch chat history only after connecting
      fetch(`https://hope-connect-server.onrender.com/api/chat/${userId}/${otherUser._id}`)
        .then(res => res.json())
        .then(data => {
          setMessages(Array.isArray(data) ? data : []);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching chat history:", err);
          setIsLoading(false);
        });
    });

    // 3. Handle incoming messages (replaces ws.current.onmessage)
    socket.on('receive_message', (data) => {
      // Data is already parsed by Socket.IO
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
      }
    });
    
    // 4. Handle connection loss (replaces ws.current.onclose/onerror)
    socket.on('disconnect', (reason) => {
      console.warn('🔌 Socket.IO disconnected:', reason);
      setIsConnected(false);
      // Socket.IO attempts automatic reconnection
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO Connection error:', error.message);
      setIsConnected(false);
    });
    
    // 5. Cleanup function
    return () => {
      if (socketRef.current) {
        // Use socket.disconnect() instead of close()
        socketRef.current.disconnect();
      }
    };
  }, [userId, currentUser, otherUser, navigate]);

  const sendMessage = () => {
    // Check connection and text
    if (!text.trim() || !isConnected || !socketRef.current) return;

    const payload = {
      from: userId,
      to: otherUser._id,
      text: text.trim(),
    };

    // Use socket.emit() instead of ws.send()
    // Socket.IO handles serialization automatically
    socketRef.current.emit('send_message', payload); 
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-5xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {getInitials(otherUser.name)}
                  </div>
                  {isConnected && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {otherUser.name || 'Counselor'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isConnected ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="h-full overflow-y-auto px-4 py-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a conversation</h3>
                  <p className="text-gray-500">Send a message to begin chatting with {otherUser.name}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => {
                  // NEW LOGIC: Determine sender's ID robustly (handle string ID or populated object)
                  const senderId = msg.from?._id || msg.from;
                  const isMine = senderId?.toString() === userId.toString();
                  
                  const showAvatar = i === 0 || messages[i - 1].from?.toString() !== msg.from?.toString();
                  
                  return (
                    <div
                      key={i}
                      className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {!isMine && (
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                              {getInitials(otherUser.name)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        <div
                          className={`px-4 py-2.5 shadow-md ${
                            isMine
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl rounded-bl-xl rounded-br-sm'
                              : 'bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl rounded-bl-sm shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-1 px-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(msg.timestamp || msg.createdAt)}
                          </span>
                          {isMine && (
                            <CheckCheck className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                      </div>
                      
                      {isMine && <div className="w-8 h-8 flex-shrink-0"></div>}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  style={{ maxHeight: '120px' }}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!isConnected || !text.trim()}
                className={`p-3.5 rounded-full font-semibold transition-all shadow-md ${
                  isConnected && text.trim()
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {!isConnected && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Connection lost. Trying to reconnect...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



