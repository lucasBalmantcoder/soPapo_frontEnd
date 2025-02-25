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
export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.response?.data || error.message);
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
        throw new Error('Erro ao buscar perfil do usuário');
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
    const response = await axios.post(
        '/api/create_room',  // URL da sua API
        // const response = await axios.get(`${API_URL}/user/profile`
        { name: roomName, usernames: usernames },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Não é mais necessário exportar no final
