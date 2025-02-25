import React, { useState } from 'react';
import { createRoom } from '../services/api';  // Aqui você terá a função que faz a chamada POST para criar a sala
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [usernames, setUsernames] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            const response = await createRoom(token, roomName, usernames.split(','));
            console.log('Sala criada com sucesso:', response);
            navigate('/');  // Redireciona para a página inicial após criar a sala
        } catch (err) {
            console.error('Erro ao criar a sala:', err);
            setError('Erro ao criar a sala.');
            setLoading(false);
        }
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
                    <label>Usuários (separados por vírgula)</label>
                    <input
                        type="text"
                        value={usernames}
                        onChange={(e) => setUsernames(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Sala'}
                </button>
            </form>
        </div>
    );
};

export default CreateRoom;
