import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RemoverUserRoom = () => {
    const { roomId } = useParams();  
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomUsers = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://127.0.0.1:5000/auth/rooms/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data.users || []);
            } catch (err) {
                setError('Erro ao carregar usuários da sala.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoomUsers();
    }, [roomId]);

    const removeUserFromRoom = async (userId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://127.0.0.1:5000/auth/rooms/${roomId}/remove_user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Usuário removido da sala com sucesso!');
            setUsers(users.filter(user => user.user_id !== userId)); // Remove usuário da lista sem recarregar a página
        } catch (err) {
            setError(`Erro ao remover o usuário. Detalhes: ${err.response ? err.response.data : err.message}`);
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {/* Título para "Usuários na Sala" */}
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Usuários na Sala</h3>
            <ul>
                {users.length === 0 ? (
                    <li>Nenhum usuário encontrado na sala.</li>
                ) : (
                    users.map((user) => (
                        <li key={user.user_id}>
                            {/* Botão para remover com nome e email */}
                            <button onClick={() => removeUserFromRoom(user.user_id)}>
                                Remover {user.username} - {user.email}
                            </button>
                        </li>
                    ))
                )}
            </ul>

            <div style={{ display: 'flex', gap: '10px' }}>
                {/* Botões para voltar e adicionar usuário */}
                <button onClick={() => navigate(`/room/${roomId}`)}>Voltar</button>
                <button onClick={() => navigate(`/add-user/${roomId}`)}>Adicionar Usuário</button>
            </div>
        </div>
    );
};

export default RemoverUserRoom;
