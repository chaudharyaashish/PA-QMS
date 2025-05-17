// src/api/messageApi.js - API service for chat
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const messageApi = {
    getConversations: async () => {
        try {
            const response = await axios.get(`${API_URL}/messages/conversations`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getConversation: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    sendMessage: async (receiverId, content) => {
        try {
            const response = await axios.post(
                `${API_URL}/messages`,
                {receiverId, content},
                {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    markAsRead: async (senderId) => {
        try {
            const response = await axios.put(
                `${API_URL}/messages/read/${senderId}`,
                {},
                {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteMessage: async (messageId) => {
        try {
            const response = await axios.delete(
                `${API_URL}/messages/${messageId}`,
                {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
    , fetchUsers: async () => {
        try {
            const response = await axios.get(
                `${API_URL}/messages/users`,
                {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default messageApi;