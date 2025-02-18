import React, { useState, useEffect } from "react"; // Importar useState e useEffect
import axios from "axios";

function ProfilePage() {
    const [profileMessage, setProfileMessage] = useState(''); // Corrigido o nome da variável
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => { // Corrigido o nome da função
            try {
                // obter o token JWT armazenado
                const token = localStorage.getItem("token");

                if (!token) {
                    // Se o token não existir, vai para tela de login
                    window.location.href = "/login";
                    return;
                }

                // Enviar a requisição à rota profile
                const response = await axios.get("http://localhost:5000/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                // Armazenar a mensagem de boas-vindas no estado
                setProfileMessage(response.data.message);
                setLoading(false);
            } catch (error) {
                setError("Erro ao carregar o perfil");
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
          <h2>Perfil</h2>
          <p>{profileMessage}</p> {/* Corrigido o nome da variável */}
        </div>
    );
}

export default ProfilePage;
