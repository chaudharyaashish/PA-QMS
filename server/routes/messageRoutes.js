const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const {authenticateToken} = require('../middleware/authMiddleware');

// Send a new message
router.post('/', authenticateToken, messageController.sendMessage);

// Get conversation with specific user
router.get('/conversation/:userId', authenticateToken, messageController.getConversation);

// Get all conversations for the current user
router.get('/conversations', authenticateToken, messageController.getAllConversations);

// Mark messages from a specific sender as read
router.put('/read/:senderId', authenticateToken, messageController.markAsRead);

// Delete a specific message
router.delete('/:messageId', authenticateToken, messageController.deleteMessage);

router.get("/users",authenticateToken, messageController.getUsers);

module.exports = router;