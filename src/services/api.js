import axios from 'axios';

const API_URL = 'http://localhost:5000/auth'; // Ajuste conforme necessário

// Função para fazer login
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/login`, 
            { username, password }, 
            { withCredentials: true } // Permite envio de cookies/sessões, caso necessário
        );
        return response.data; // Retorna o token ou resposta do backend
    } catch (error) {
        console.error('Erro ao fazer login:', error.response?.data || error.message);
        throw error;
    }
};

// Função para registrar um novo usuário (caso precise)
export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.response?.data || error.message);
        throw error;
    }
};

export const getUserRooms = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/rooms`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar salas do usuário:', error.response?.data || error.message);
        throw error;
    }
};


// Função para obter os dados do usuário autenticado

export const getUserProfile = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        
        // Verifique se o token existe
        if (!accessToken) {
            throw new Error('Token de autenticação não encontrado');
        }

        // Faz a requisição GET para obter o perfil do usuário
        const response = await axios.get('http://127.0.0.1:5000/auth/user/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Retorna os dados do perfil do usuário
        return response.data;
    } catch (error) {
        console.error('Erro ao obter o perfil do usuário:', error);
        throw new Error('Erro ao buscar perfil do usuário');
    }
};


