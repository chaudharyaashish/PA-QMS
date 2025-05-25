
import React from 'react';

const ConversationList = ({
                              users,
                              onSelectConversation,
                          }) => {
    if (users.length === 0) {
        return <div className="no-conversations">No conversations yet</div>;
    }

    return (
        <div className="conversation-list">
            {users.map(user => (
                <div
                    key={user.id}
                    className={`conversation-item`}
                    onClick={() => onSelectConversation(user)}
                >
                    <div className="conversation-avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="conversation-details">
                        <div className="conversation-header">
                            <h4>{user.name}</h4>
                            <span className="conversation-time"></span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;