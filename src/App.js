import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home'; 
import Profile from './pages/ProfilePage';  // Página de perfil do usuário

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />  {/* Rota de login */}
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />  {/* Página de perfil */}
            </Routes>
        </Router>
    );
}

export default App;
