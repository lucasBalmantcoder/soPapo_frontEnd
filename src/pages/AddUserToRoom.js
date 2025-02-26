import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddUserToRoom = () => {
    const { roomId } = useParams();  
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                setUsers(response.data); 
            } catch (err) {
                setError('Erro ao carregar usuários.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, []);

    const addUserToRoom = async (userId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `http://127.0.0.1:5000/auth/rooms/${roomId}/add_user/${userId}`,
                {},  // Corpo da requisição vazio
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('Usuário adicionado à sala com sucesso!');
            navigate(`/room/${roomId}`);
        } catch (err) {
            setError(`Erro ao adicionar o usuário à sala. Detalhes: ${err.response ? err.response.data : err.message}`);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h3>Gerenciar Usuários na Sala</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                {/* Botão para adicionar usuários */}
                <button onClick={() => navigate(`/add-users/${roomId}`)}>
                    Adicionar Usuários
                </button>

                {/* Botão para remover usuários */}
                <button onClick={() => navigate(`/remove-users/${roomId}`)}>
                    Remover Usuários
                </button>
            </div>

            <ul>
                {users.length === 0 ? (
                    <li>Nenhum usuário encontrado.</li>
                ) : (
                    users.map((user) => (
                        <li key={user.id}>
                            <button onClick={() => addUserToRoom(user.id)}>
                                Adicionar {user.username} - {user.email}
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AddUserToRoom;
