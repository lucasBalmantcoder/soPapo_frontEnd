import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Remova useNavigate
import axios from "axios";

const DeleteUsersPage = () => {
    const { roomId } = useParams();
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = "http://127.0.0.1:5000/auth";

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(`${API_URL}/rooms/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsersInRoom(response.data.users);
                setLoading(false);
            } catch (err) {
                setError("Erro ao carregar usuários da sala.");
                setLoading(false);
            }
        };

        if (roomId) {
            fetchUsers();
        }
    }, [roomId]);

    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleDeleteSelectedUsers = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            for (const userId of selectedUsers) {
                await axios.delete(`${API_URL}/rooms/${roomId}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setUsersInRoom((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.user_id)));
            setSelectedUsers([]);
        } catch (error) {
            setError("Erro ao excluir usuários.");
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Excluir Usuários da Sala {roomId}</h2>
            <ul>
                {usersInRoom.map((user) => (
                    <li key={user.user_id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.user_id)}
                                onChange={() => handleUserSelection(user.user_id)}
                            />
                            {user.username}
                        </label>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleDeleteSelectedUsers}
                disabled={selectedUsers.length === 0}
                style={{ backgroundColor: "red", color: "white", padding: "10px", marginTop: "10px" }}
            >
                Excluir Selecionados
            </button>
        </div>
    );
};

export default DeleteUsersPage;