import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";  // Importando a Navbar
import Login from "./pages/Login";
import Profile from "./pages/ProfilePage";
import CreateRoom from "./pages/CreateRooms";
import Register from "./pages/Register";
import Chatroom from "./pages/Chatroom";
import AddUserToRoom from "./pages/AddUserToRoom";
import DeleteUsersPage from "./pages/DeleteUsersPage";
import DeleteRooms from "./pages/DeleteRooms";  // Importando a página de deletar salas

function App() {
    return (
        <Router>
            {/* Navbar aparecerá em todas as páginas, menos na de login */}
            <Navbar />

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-room" element={<CreateRoom />} />
                <Route path="/chat" element={<Chatroom />} /> {/* Rota sem roomId */}
                <Route path="/chat/:roomId" element={<Chatroom />} /> {/* Rota com roomId */}
                <Route path="/add-user/:roomId" element={<AddUserToRoom />} />
                <Route path="/remove-user/:roomId" element={<DeleteUsersPage />} />
                <Route path="/deleterooms" element={<DeleteRooms />} /> {/* Nova rota para apagar salas */}
            </Routes>
        </Router>
    );
}

export default App;