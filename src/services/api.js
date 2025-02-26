// src/services/api.js

import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/auth'; // Ajuste conforme necessário

// Função para fazer login
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/login`, 
            { username, password }, 
            { withCredentials: true } 
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer login:', error.response?.data || error.message);
        throw error;
    }
};

// Função para registrar um novo usuário
export const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Função para obter o perfil do usuário
export const getUserProfile = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
            throw new Error('Token de autenticação não encontrado');
        }

        const response = await axios.get(`${API_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao obter o perfil do usuário:', error);
        throw error;
    }
};

// Função para obter as salas do usuário
export const getUserRooms = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/user/rooms`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar salas do usuário:', error.response?.data || error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            throw new Error('Token de autenticação não encontrado');
        }

        // Chama a rota de logout no backend para invalidar o token
        const response = await axios.post(
            'http://127.0.0.1:5000/auth/logout', // Ajuste a URL conforme necessário
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Envia o token atual para invalidá-lo
                },
            }
        );

        // Se o logout for bem-sucedido, remove o token armazenado
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); // Se armazenar o refresh token também, remova-o

        console.log(response.data.message); // Exibe a mensagem de sucesso no console

        return response.data; // Retorna a mensagem de sucesso
    } catch (error) {
        console.error('Erro ao fazer logout:', error.response?.data || error.message);
        throw error;
    }
};

export const createRoom = async (token, roomName, usernames) => {
    try {
        const response = await axios.post(
            `${API_URL}/create_room`,  // Corrigido a URL
            { name: roomName, usernames: usernames },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao criar sala:', error.response?.data || error.message);
        throw error;
    }
};



// Função para deletar uma sala
export const deleteRoom = async (roomId) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('Token de autenticação não encontrado');
        }

        const response = await axios.delete(`${API_URL}/rooms/${roomId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao deletar a sala:', error.response?.data || error.message);
        throw error;
    }
};

// Função para enviar uma mensagem para uma sala
export const sendMessage = async (token, roomId, message) => {
    try {
        const response = await axios.post(
            'http://127.0.0.1:5000/auth/messages',
            { room_id: roomId, message: message },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
        throw error;
    }
};

// Função para buscar mensagens de uma sala
export const getMessages = async (token, roomId) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/auth/messages/${roomId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.messages; // Retorna a lista de mensagens
    } catch (error) {
        console.error('Erro ao obter mensagens:', error.response?.data || error.message);
        throw error;
    }
};

