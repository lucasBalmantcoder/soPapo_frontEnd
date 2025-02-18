import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login"; // Redireciona se não estiver logado
          return;
        }

        const response = await axios.get("http://localhost:5000/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConversations(response.data.private_chats);
        setGroups(response.data.groups);
      } catch (err) {
        setError("Erro ao carregar as conversas.");
      }
    };

    fetchConversations();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Conversas Individuais</h2>
      {error && <p className="text-danger">{error}</p>}
      <ListGroup>
        {conversations.map((chat) => (
          <ListGroup.Item key={chat.id} as={Link} to={`/chat/${chat.id}`}>
            {chat.name}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h2 className="mt-4">Grupos</h2>
      <ListGroup>
        {groups.map((group) => (
          <ListGroup.Item key={group.id} as={Link} to={`/group/${group.id}`}>
            {group.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Home;
