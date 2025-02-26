

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const Chatroom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState("");
    const [rooms, setRooms] = useState([]);
    
    const messageContainerRef = useRef(null); // Referência para o container das mensagens

    const API_URL = "http://127.0.0.1:5000/auth";

    // Carrega as salas e mensagens
    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    
        const fetchRooms = async () => {
            try {
                setLoading(true); // Define loading como true antes de buscar os dados
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(`${API_URL}/user/rooms`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRooms(response.data.rooms);
                setLoading(false); // Define loading como false após os dados serem carregados
            } catch (err) {
                setError("Erro ao carregar salas.");
                setLoading(false); // Define loading como false em caso de erro
            }
        };
    
        const fetchMessages = async (roomId) => {
            if (!roomId || roomId === "undefined") {
                console.error("Erro: roomId inválido", roomId);
                return;
            }
        
            try {
                setLoading(true); // Define loading como true antes de buscar as mensagens
                const response = await fetch(`http://127.0.0.1:5000/auth/messages/${roomId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}` // Corrigido o nome do token
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`Erro ao buscar mensagens: ${response.statusText}`);
                }
        
                const data = await response.json();
                console.log("Mensagens carregadas:", data); // Verifique se as mensagens estão sendo carregadas corretamente
                setMessages(data.messages); // Atualize o estado de mensagens
                setLoading(false); // Define loading como false após as mensagens serem carregadas
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
                setLoading(false); // Define loading como false em caso de erro
            }
        };
    
        fetchRooms();
        if (roomId) {
            fetchMessages(roomId);
        }
    }, [roomId]);

    // Envia uma mensagem
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                `${API_URL}/messages`,
                { room_id: roomId, message: newMessage },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            setNewMessage("");
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    username: currentUser || "Você",
                    message: newMessage,
                    timestamp: new Date().toISOString(),
                },
            ]);
        } catch (error) {
            setError("Erro ao enviar mensagem.");
        }
    };

    // Envia mensagem ao pressionar Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    // Função para rolar a página até a última mensagem
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    // Chama a função de rolar até o final sempre que as mensagens são atualizadas
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Renderiza uma mensagem
    const renderMessage = (msg, index) => {
        const isCurrentUser = msg.username.trim().toLowerCase() === currentUser.trim().toLowerCase();
        return (
            <div
                key={index}
                style={{
                    marginBottom: "10px",
                    padding: "10px",
                    borderRadius: "5px",
                    backgroundColor: isCurrentUser ? "#dcf8c6" : "#f5f5f5",
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                    marginLeft: isCurrentUser ? "auto" : "10px",
                    marginRight: isCurrentUser ? "10px" : "auto",
                }}
            >
                <strong
                    style={{
                        color: isCurrentUser ? "#075e54" : "black",
                        fontWeight: isCurrentUser ? "bold" : "normal",
                    }}
                >
                    {msg.username || "Usuário Desconhecido"}:
                </strong>{" "}
                {msg.message}
                <br />
                <small style={{ color: "#666" }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
        );
    };

    // Renderiza a lista de salas
    const renderRooms = () => (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, height: "calc(100vh - 20px)", overflowY: "auto" }}>
            {rooms.map((room) => (
                <li
                    key={room.room_id}
                    style={{
                        padding: "10px",
                        marginBottom: "5px",
                        backgroundColor: room.room_id === roomId ? "#dcf8c6" : "#f5f5f5",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate(`/chat/${room.room_id}`)}
                >
                    {room.room_name} (Criado por: {room.creator})
                </li>
            ))}
        </ul>
    );

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ display: "flex", height: "98vh", margin: 0, padding: 0, overflow: "hidden", boxSizing: "border-box" }}>
            {/* Coluna das Salas (20% da tela) */}
            <div style={{ flex: "0 0 20%", borderRight: "1px solid #ccc", padding: "10px", overflowY: "hidden", boxSizing: "border-box" }}>
                <h3 style={{ margin: 0 }}>Salas de Conversa</h3>
                {renderRooms()}
            </div>

            {/* Coluna do Chat (80% da tela) */}
            <div style={{ flex: "0 0 80%", display: "flex", flexDirection: "column", height: "100vh", boxSizing: "border-box" }}>
                <h2 style={{ padding: "10px", borderBottom: "1px solid #ccc", margin: 0 }}>
                    Chat da Sala {roomId}
                </h2>
                <div 
                    ref={messageContainerRef} 
                    style={{ flex: 1, padding: "10px", overflowY: "auto", boxSizing: "border-box", display: "flex", flexDirection: "column" }}
                >
                    {messages.length > 0 ? (
                        messages.map((msg, index) => renderMessage(msg, index))
                    ) : (
                        <p>Nenhuma mensagem ainda.</p>
                    )}
                </div>
                <div style={{ padding: "30px", borderTop: "1px solid #ccc", boxSizing: "border-box" }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite sua mensagem..."
                        style={{ width: "80%", padding: "5px", boxSizing: "border-box" }}
                        autoFocus
                    />
                    <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "5px" }}>
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatroom;