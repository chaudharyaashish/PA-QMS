// src/components/ChatLayout.jsx - Main chat layout component
import React, {useContext, useEffect, useState} from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import messageApi from '../api/messageApi';
import {AuthContext} from '../context/AuthContext';

const ChatLayout = () => {
    const {currentUser} = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all conversations
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await messageApi.fetchUsers();
                setUsers(res.data);
                console.log(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load conversations');
                setLoading(false);
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    // Handle selecting a conversation
    const handleSelectConversation = async (user) => {
        try {
            setSelectedUser(user);
            setLoading(true);

            // Get conversation messages
            const res = await messageApi.getConversation(user.id);
            setMessages(res.data);

            setLoading(false);
        } catch (err) {
            setError('Failed to load conversation');
            setLoading(false);
            console.error(err);
        }
    };

    // polling
    useEffect(() => {
        // Only start polling if a user is selected
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const res = await messageApi.getConversation(selectedUser.id);
                setMessages(res.data);
            } catch (err) {
                console.error("Error polling messages:", err);
                // Optional: set a specific error for polling issues
                // setError('Connection issues while refreshing messages');
            }
        };

        // Initial fetch
        fetchMessages();

        // Set up interval for polling (every 3 seconds)
        const intervalId = setInterval(fetchMessages, 3000);

        // Clean up function to clear interval when component unmounts
        // or when selectedUser changes
        return () => clearInterval(intervalId);

    }, [selectedUser])

    // Handle sending a message
    const handleSendMessage = async (content) => {
        if (!selectedUser || !content.trim()) return;

        try {
            const receiverId = selectedUser.id;
            const res = await messageApi.sendMessage(receiverId, content);

            // Update messages with the new message
            const newMessage = res.data;
            setMessages(prevMessages => [...prevMessages, newMessage]);

        } catch (err) {
            setError('Failed to send message');
            console.error(err);
        }
    };

    // Handle deleting a message
    const handleDeleteMessage = async (messageId) => {
        try {
            await messageApi.deleteMessage(messageId);
            setMessages(prevMessages =>
                prevMessages.filter(message => message.id !== messageId)
            );
        } catch (err) {
            setError('Failed to delete message');
            console.error(err);
        }
    };

    return (
        <div className="chat-layout">
            <div className="sidebar">
                <h2>Messages</h2>
                <ConversationList
                    users={users}
                    onSelectConversation={handleSelectConversation}
                    currentUser={currentUser}
                />
            </div>
            <div className="chat-container">
                {selectedUser ? (
                    <ChatWindow
                        messages={messages}
                        receiver={selectedUser}
                        currentUser={currentUser}
                        onSendMessage={handleSendMessage}
                        onDeleteMessage={handleDeleteMessage}
                        loading={loading}
                    />
                ) : (
                    <div className="empty-chat">
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ChatLayout;
