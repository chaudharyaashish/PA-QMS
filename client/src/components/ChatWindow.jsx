// In ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import MessageItem from './MessageItem';

const ChatWindow = ({
                        messages,
                        receiver,
                        currentUser,
                        onSendMessage,
                        onDeleteMessage,
                        loading
                    }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // After sending a message, always scroll to bottom
    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-user-info">
                    <div className="user-avatar">{receiver.name.charAt(0).toUpperCase()}</div>
                    <div className="user-details">
                        <h3>{receiver.name}</h3>
                        <span className="user-status">{receiver.role}</span>
                    </div>
                </div>
            </div>

            <div
                className="messages-container"
                ref={messagesContainerRef}
            >
                {loading ? (
                    <div className="loading">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">No messages yet. Start a conversation!</div>
                ) : (
                    <>
                        {messages.map(message => (
                            <MessageItem
                                key={message.id}
                                message={message}
                                isOwnMessage={message.senderId === currentUser.id}
                                onDelete={() => onDeleteMessage(message.id)}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <form className="message-input-form" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;