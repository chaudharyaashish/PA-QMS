// src/components/MessageItem.js - Individual message component
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const MessageItem = ({ message, isOwnMessage, onDelete }) => {
    return (
        <div className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}>
            <div className="message-content">
                {message.content}
            </div>
            <div className="message-meta">
        <span className="message-time">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
                {isOwnMessage && (
                    <button className="delete-button" onClick={onDelete}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default MessageItem;