import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteRoom = () => {
    const [rooms, setRooms] = useState([]);  // Salas do usuário
    const [selectedRooms, setSelectedRooms] = useState([]);  // Salas selecionadas para exclusão
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setError('Usuário não autenticado.');
                    return;
                }
    
                const response = await axios.get('http://127.0.0.1:5000/user/rooms', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                console.log('Resposta da API:', response);  // Verifique a resposta completa da API
                setRooms(response.data.rooms);  // Atualiza a lista de salas
            } catch (err) {
                console.error('Erro ao fazer a requisição:', err);  // Log completo do erro
                setError('Erro ao carregar salas.');
            }
        };
    
        fetchRooms();
    }, []);
    
    

    const handleRoomSelection = (roomId) => {
        setSelectedRooms((prevSelectedRooms) =>
            prevSelectedRooms.includes(roomId)
                ? prevSelectedRooms.filter((id) => id !== roomId)  // Desmarcar se já estiver selecionada
                : [...prevSelectedRooms, roomId]  // Adicionar à lista de selecionados
        );
    };

    const handleDeleteRooms = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        try {
            for (let roomId of selectedRooms) {
                await axios.delete(`http://127.0.0.1:5000/rooms/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            setRooms(rooms.filter((room) => !selectedRooms.includes(room.room_id)));
            setSelectedRooms([]);
            setLoading(false);
        } catch (err) {
            setError('Erro ao apagar as salas.');
            setLoading(false);
        }
    };

    const handleBackToChat = () => {
        navigate('/chat'); // Substitua com a rota da sala de chat
    };

    return (
        <div>
            <h2>Excluir Salas</h2>
            {error && <p>{error}</p>}
            <ul>
                {rooms.map((room) => (
                    <li key={room.room_id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedRooms.includes(room.room_id)}
                                onChange={() => handleRoomSelection(room.room_id)}
                            />
                            {room.room_name} - Criada por {room.creator} em {room.created_at}
                        </label>
                    </li>
                ))}
            </ul>
            <div className="buttons-container">
                <button onClick={handleDeleteRooms} disabled={loading || selectedRooms.length === 0}>
                    {loading ? 'Deletando...' : 'Excluir Salas Selecionadas'}
                </button>
                <button className="back-to-chat-button" onClick={handleBackToChat}>
                    Voltar para a Sala de Chat
                </button>
            </div>
        </div>
    );
};

export default DeleteRoom;
