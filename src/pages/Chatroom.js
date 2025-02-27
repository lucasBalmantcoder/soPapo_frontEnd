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
    const inputRef = useRef(null); // Referência para o campo de entrada

    const API_URL = "http://127.0.0.1:5000/auth";

    // Função para rolar a página até a última mensagem
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            // Usa `scrollTo` para garantir que a rolagem seja suave e precisa
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    // Carrega as salas e mensagens
    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        if (storedUser) {
            setCurrentUser(storedUser);
        }

        const fetchRooms = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(`${API_URL}/user/rooms`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRooms(response.data.rooms);
                setLoading(false);
            } catch (err) {
                setError("Erro ao carregar salas.");
                setLoading(false);
            }
        };

        const fetchMessages = async (roomId) => {
            if (!roomId || roomId === "undefined") {
                console.error("Erro: roomId inválido", roomId);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:5000/auth/messages/${roomId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar mensagens: ${response.statusText}`);
                }

                const data = await response.json();
                setMessages(data.messages);
                setLoading(false);

                // Rola para a última mensagem após carregar as mensagens
                setTimeout(scrollToBottom, 100); // Aguarda 100ms para garantir que o DOM seja renderizado
            } catch (error) {
                setError("Erro ao buscar mensagens.");
                setLoading(false);
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

            // Atualiza o estado das mensagens
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    username: currentUser || "Você",
                    message: newMessage,
                    timestamp: new Date().toISOString(),
                },
            ]);

            // Limpa o campo de entrada
            setNewMessage("");

            // Foca no campo de entrada após o envio da mensagem
            if (inputRef.current) {
                inputRef.current.focus();
            }

            // Rola para a última mensagem após o estado ser atualizado
            setTimeout(scrollToBottom, 100); // Aguarda 100ms para garantir que o DOM seja renderizado
        } catch (error) {
            setError("Erro ao enviar mensagem.");
        }
    };

    const handleRoomSelect = (roomId) => {
        navigate(`/chat/${roomId}`);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    const handleCreateRoom = () => {
        navigate("/create-room"); // Roteamento para a página de criação de salas
    };

    const handleDeleteRoom = () => {
        navigate("/deleterooms"); // Roteamento para a página de exclusão de salas
    };

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
                    onClick={() => handleRoomSelect(room.room_id)}
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
            <div style={{ flex: "0 0 20%", borderRight: "1px solid #ccc", padding: "10px", overflowY: "hidden", boxSizing: "border-box" }}>
                <h3 style={{ margin: 0 }}>Salas de Conversa</h3>
                {renderRooms()}
            </div>

            <div style={{ flex: "0 0 80%", display: "flex", flexDirection: "column", height: "100vh", boxSizing: "border-box" }}>
                <h2 style={{ padding: "10px", borderBottom: "1px solid #ccc", margin: 0 }}>
                    Chat da Sala {roomId || "Nenhuma sala selecionada"}
                </h2>
                <div ref={messageContainerRef} style={{ flex: 1, padding: "10px", overflowY: "auto", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
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
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder={roomId ? "Digite sua mensagem..." : "Selecione uma sala para enviar mensagens"}
                        style={{ width: "80%", padding: "5px", boxSizing: "border-box" }}
                        disabled={!roomId}
                        ref={inputRef}
                    />
                    <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "5px" }} disabled={!roomId}>
                        Enviar
                    </button>
                </div>

                {/* Ícone flutuante para criar uma nova sala */}
                <div
                    onClick={handleCreateRoom}
                    style={{
                        position: "fixed",
                        bottom: "30px",
                        left: "70px",
                        backgroundColor: "#62BECAFF",
                        color: "white",
                        borderRadius: "0%",
                        padding: "15px",
                        cursor: "pointer",
                        fontSize: "24px"
                    }}
                >
                    criar nova sala
                </div>
                    {/* Ícone flutuante para criar uma nova sala */}
                    <div
                    onClick={handleDeleteRoom}
                    style={{
                        position: "fixed",
                        top: "50%",  // Centraliza verticalmente
                        left: "70px",
                        backgroundColor: "#62BECAFF",
                        color: "white",
                        borderRadius: "0%",  // Deixe o border-radius maior para um formato redondo
                        padding: "15px",
                        cursor: "pointer",
                        fontSize: "24px",
                        transform: "translateY(500%)",  // Ajuste para corrigir o alinhamento
                    }}
                    >
                        Deletar Sala
                    </div>


               

            </div>
        </div>
    );
};

export default Chatroom;