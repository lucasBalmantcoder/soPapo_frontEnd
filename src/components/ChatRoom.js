import { useState, useEffect } from 'react';
import { sendMessage, getMessages } from '../services/api';

const Chat = ({ token, roomId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Função para carregar mensagens da sala
    const fetchMessages = async () => {
        try {
            const msgs = await getMessages(token, roomId);
            setMessages(msgs);
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
    };

    // Função para enviar mensagem
    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            await sendMessage(token, roomId, newMessage);
            setNewMessage('');
            fetchMessages(); // Atualiza as mensagens após enviar
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    // Carregar mensagens quando o componente montar
    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.user_id}:</strong> {msg.message}</p>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
            />
            <button onClick={handleSendMessage}>Enviar</button>
        </div>
    );
};

export default Chat;
