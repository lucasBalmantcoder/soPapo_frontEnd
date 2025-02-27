import React, { useState, useEffect } from 'react';
import { createRoom } from '../services/api';  // Função para criar a sala
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [users, setUsers] = useState([]);  // Lista de usuários disponíveis
    const [selectedUsers, setSelectedUsers] = useState([]);  // Usuários selecionados
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://127.0.0.1:5000/auth/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);  // Atualiza a lista de usuários
            } catch (err) {
                setError('Erro ao carregar usuários.');
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        try {
            const response = await createRoom(token, roomName, selectedUsers);  // Envia os usuários selecionados
            console.log('Sala criada com sucesso:', response);
            navigate('/');  // Redireciona para a página inicial após criar a sala
        } catch (err) {
            console.error('Erro ao criar a sala:', err);
            setError('Erro ao criar a sala.');
            setLoading(false);
        }
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter((id) => id !== userId)  // Desmarcar se já estiver selecionado
                : [...prevSelectedUsers, userId]  // Adicionar à lista de selecionados
        );
    };

    const handleBackToChat = () => {
        navigate('/chat'); // Substitua com a rota da sala de chat
    };

    return (
        <div>
            <h2>Criar Nova Sala</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome da Sala</label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Escolha os Usuários</label>
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserSelection(user.id)}
                                    />
                                    {user.username}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Sala'}
                </button>
            </form>

            <div className="buttons-container">
                
                <button className="back-to-chat-button" onClick={handleBackToChat}>
                    Voltar para a Sala de Chat
                </button>
            </div>
        </div>
    );
};

export default CreateRoom;
