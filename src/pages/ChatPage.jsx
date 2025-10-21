import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // backend WebSocket endpoint

export default function ChatPage({ currentUser }) {
  const location = useLocation();
  const { counselor, victim } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const otherUser = currentUser.role === 'victim' ? counselor : victim;

  useEffect(() => {
    if (!currentUser) return;
    socket.emit('join', currentUser._id);

    // Fetch message history
    fetch(`https://hope-connect-server.onrender.com/api/chat/${currentUser._id}/${otherUser._id}`)
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error);

    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => socket.off('receive_message');
  }, [currentUser, otherUser]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit('send_message', { from: currentUser._id, to: otherUser._id, text });
    setText('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Chat with {otherUser?.name || 'User'}
        </h2>
        <div className="h-96 overflow-y-auto border rounded-lg p-3 bg-gray-50 mb-3">
          {messages.map((msg) => (
            <div key={msg._id || Math.random()} className={`my-2 flex ${msg.from._id === currentUser._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-2xl ${msg.from._id === currentUser._id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            className="flex-grow border rounded-l-lg p-2"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
