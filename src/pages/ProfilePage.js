import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import { format } from 'date-fns'; // Importe a função 'format' do date-fns

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');

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

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>Carregando...</div>;
    }

    // Formatar a data para um formato legível
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
