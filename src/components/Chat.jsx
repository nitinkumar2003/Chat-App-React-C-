// Chat.js
import React, { useEffect, useState } from 'react';
import connection from './signalr';

const usersList = [{ label: "A", value: "3" }, { label: "NK", value: "2" }];

const Chat = ({ user }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [receiverId, setReceiverId] = useState('');

    useEffect(() => {
      
        // setInterval(() => {
        //     connect() 
        // }, 1000);
        connect();

        return () => {
            connection.off('ReceiveMessage');
            connection.off('ErrorMessage');
            if (connection.state === 'Connected') {
                connection.stop();
            }
        };
    }, []);

    const connect = async () => {

        console.log('connectconnect')
        
        connection.on('ReceiveMessage', (senderUserId, message) => {
            console.log(`Message from ${senderUserId}: ${message}`);
            setMessages(messages => [...messages, { senderUserId, message }]);
        });

        connection.on('ErrorMessage', (errorMessage) => {
            console.error("Error from server:", errorMessage);
        });

        if (connection.state === 'Disconnected') {
            try {
                await connection.start();
                console.log('Connected to SignalR');
            } catch (err) {
                console.error('SignalR Connection Error: ', err);
            }
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const senderName = user.username;
        const senderId = `${user.userId}`;
        if (message.trim() === '') {
            return;
        }

        try {
          const result=  await connection.invoke('SendMessageToUser', receiverId, message, senderId);
          console.log('result',result)  
        //   setMessages(prevMessages => [...prevMessages, { sender: senderName, message }]);
          setMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleSelect = (e) => {
        setReceiverId(e.target.value);
    }

    return (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <p>{user.username}</p>
            <form onSubmit={sendMessage} className="space-y-4">
                <div className="relative">
                    <select
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state"
                        value={receiverId}
                        onChange={handleSelect}
                    >
                        <option value={''} disabled>Select</option>
                        {usersList.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule='evenodd'
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Send
                </button>
            </form>
            <div className="mt-4">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.sender}: </strong>{msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
