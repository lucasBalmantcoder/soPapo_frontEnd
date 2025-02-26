import React, { useEffect, useState } from 'react';
import { getUserProfile, deleteRoom } from '../services/api'; // Importe a função deleteRoom
import { format } from 'date-fns';

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const data = await getUserProfile();
                setUserInfo(data);
            } catch (err) {
                setError('Erro ao carregar as informações do usuário.');
            }
        };

        fetchUserProfile();
    }, []);

    const handleDeleteRoom = async (roomId) => {
        if (window.confirm("Você tem certeza que deseja apagar esta sala?")) {
            setDeleting(true);
            try {
                await deleteRoom(roomId); // Chama a função para deletar a sala
                setUserInfo(prevState => ({
                    ...prevState,
                    admin_rooms: prevState.admin_rooms.filter(room => room.room_id !== roomId),
                }));
            } catch (err) {
                setError('Erro ao tentar apagar a sala.');
            } finally {
                setDeleting(false);
            }
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>Carregando...</div>;
    }

    const formattedDate = userInfo.created_at ? format(new Date(userInfo.created_at), 'dd/MM/yyyy HH:mm:ss') : '';

    return (
        <div>
            <h2>Perfil do Usuário</h2>
            <p><strong>Nome de usuário:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Criado em:</strong> {formattedDate}</p>

            <h3>Salas Administradas</h3>
            {userInfo.admin_rooms && userInfo.admin_rooms.length > 0 ? (
                <ul>
                    {userInfo.admin_rooms.map((room) => (
                        <li key={room.room_id}>
                            <strong>{room.room_name}</strong> (Criado em: {room.created_at})
                            <button
                                onClick={() => handleDeleteRoom(room.room_id)}
                                disabled={deleting}
                            >
                                {deleting ? 'Deletando...' : 'Deletar'}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Você não administra nenhuma sala.</p>
            )}
        </div>
    );
};

export default ProfilePage;
