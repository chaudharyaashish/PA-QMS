const Message = require('../models/Message');
const User = require('../models/User');
const {Op} = require('sequelize');
const sequelize = require('sequelize');

class MessageController {
    // send message
    async sendMessage(req, res) {
        try {
            const {receiverId, content} = req.body;
            const senderId = req.user.id; 

          
            const receiver = await User.findByPk(receiverId);
            if (!receiver) {
                return res.status(404).json({success: false, message: 'Receiver not found'});
            }

            // create message
            const message = await Message.create({
                senderId,
                receiverId,
                content
            });

            return res.status(201).json({
                success: true,
                message: 'Message sent successfully',
                data: message
            });
        } catch (error) {
            console.error('Error sending message:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send message',
                error: error.message
            });
        }
    }

    
    async getConversation(req, res) {
        try {
            const currentUserId = req.user.id;
            const {userId} = req.params;

            
            const otherUser = await User.findByPk(userId);
            if (!otherUser) {
                return res.status(404).json({success: false, message: 'User not found'});
            }

            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        {senderId: currentUserId, receiverId: userId},
                        {senderId: userId, receiverId: currentUserId}
                    ]
                },
                order: [['createdAt', 'ASC']],
                include: [
                    {model: User, as: 'sender', attributes: ['id', 'name', 'email']},
                    {model: User, as: 'receiver', attributes: ['id', 'name', 'email']}
                ]
            });

            await Message.update(
                {isRead: true},
                {
                    where: {
                        senderId: userId,
                        receiverId: currentUserId,
                        isRead: false
                    }
                }
            );

            return res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            console.error('Error fetching conversation:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch conversation',
                error: error.message
            });
        }
    }

    async getAllConversations(req, res) {
        try {
            const userId = req.user.id;

            const conversations = await Message.findAll({
                attributes: [
                    [
                        sequelize.literal(`CASE 
                        WHEN "senderId" = ${userId} THEN "receiverId" 
                        ELSE "senderId" 
                    END`),
                        'otherUserId'
                    ],
                    [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastMessageAt']
                ],
                where: {
                    [Op.or]: [
                        {senderId: userId},
                        {receiverId: userId}
                    ]
                },
                group: [sequelize.literal(`CASE 
                WHEN "senderId" = ${userId} THEN "receiverId" 
                ELSE "senderId" 
            END`)],
                order: [[sequelize.fn('MAX', sequelize.col('createdAt')), 'DESC']],
                raw: true
            });

            const conversationDetails = await Promise.all(
                conversations.map(async (conv) => {
                    const otherUserId = conv.otherUserId;

                    const otherUser = await User.findByPk(otherUserId, {
                        attributes: ['id', 'name', 'email', 'role']
                    });

                    const latestMessage = await Message.findOne({
                        where: {
                            [Op.or]: [
                                {senderId: userId, receiverId: otherUserId},
                                {senderId: otherUserId, receiverId: userId}
                            ]
                        },
                        order: [['createdAt', 'DESC']]
                    });

                    const unreadCount = await Message.count({
                        where: {
                            senderId: otherUserId,
                            receiverId: userId,
                            isRead: false
                        }
                    });

                    return {
                        user: otherUser,
                        lastMessage: latestMessage,
                        unreadCount,
                        lastMessageAt: conv.lastMessageAt
                    };
                })
            );

            return res.status(200).json({
                success: true,
                data: conversationDetails
            });
        } catch (error) {
            console.error('Error fetching conversations:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch conversations',
                error: error.message
            });
        }
    }

    async markAsRead(req, res) {
        try {
            const currentUserId = req.user.id;
            const {senderId} = req.params;

            const result = await Message.update(
                {isRead: true},
                {
                    where: {
                        senderId,
                        receiverId: currentUserId,
                        isRead: false
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: 'Messages marked as read',
                count: result[0]
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to mark messages as read',
                error: error.message
            });
        }
    }

    async deleteMessage(req, res) {
        try {
            const userId = req.user.id;
            const {messageId} = req.params;

            const message = await Message.findByPk(messageId);

            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Message not found'
                });
            }

            if (message.senderId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this message'
                });
            }

            await message.destroy();

            return res.status(200).json({
                success: true,
                message: 'Message deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete message',
                error: error.message
            });
        }
    }

    async getUsers(req, res) {
        try {
            const currentUserId = req.user.id;
            const role = req.user.role;
            const users = await User.findAll({
                where: {
                    id: {
                        [Op.ne]: currentUserId
                    },
                    role: {
                        [Op.ne]: 'admin'
                    }
                },
                attributes: ['id', 'name', 'email', 'role']
            });
            return res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch users',
                error: error.message
            });
        }
    }
}

module.exports = new MessageController();