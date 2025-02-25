import React, { useEffect, useState } from 'react';
import { getUserRooms } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook para redirecionar o usuário

    const fetchUserRooms = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        try {
            const data = await getUserRooms(token);
            setRooms(data.rooms);
            setLoading(false);
        } catch (err) {
            setError('Erro ao carregar salas.');
            setLoading(false);
        }
    };

    const enterRoom = (roomId) => {
        navigate(`/room/${roomId}`);  // Redireciona para a sala específica
    };

    const handleCreateRoom = () => {
        navigate('/create-room');  // Redireciona para a página de criação de sala
    };

    useEffect(() => {
        fetchUserRooms();
    }, []);

    return (
        <div>
            <h2>Suas Salas</h2>
            {loading ? (
                <p>Carregando salas...</p>
            ) : (
                <>
                    {error && <p>{error}</p>}
                    <ul>
                        {rooms.map((room) => (
                            <li key={room.room_id}>
                                <button onClick={() => enterRoom(room.room_id)}>
                                    {room.room_name} (Criado por: {room.creator})
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <button onClick={handleCreateRoom}>Criar Nova Sala</button>
        </div>
    );
};

export default Home;
