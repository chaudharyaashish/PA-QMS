const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.post('/', authenticateToken, messageController.sendMessage);

router.get('/conversation/:userId', authenticateToken, messageController.getConversation);

router.get('/conversations', authenticateToken, messageController.getAllConversations);

router.put('/read/:senderId', authenticateToken, messageController.markAsRead);

router.delete('/:messageId', authenticateToken, messageController.deleteMessage);

router.get("/users",authenticateToken, messageController.getUsers);

module.exports = router;