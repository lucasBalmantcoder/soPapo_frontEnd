import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Ocultar a navbar apenas na página de login
    if (location.pathname === "/" || location.pathname === "/login") {
        return null;
    }

    const handleLogout = () => {
        // Remover o token de autenticação do localStorage
        localStorage.removeItem("token");

        // Redirecionar para a página de login
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 p-4 flex justify-between items-center">
            {/* Nome do Projeto */}
            <Link to="/home" className="text-white text-xl font-bold">
                SóPapo
            </Link>

            {/* Botão de Logout */}
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
