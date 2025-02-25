import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';  // Importa o hook useNavigate

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Usa o hook useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(username, password);
            localStorage.setItem('accessToken', data.access);
            console.log('Login bem-sucedido:', data);

            // Após o login bem-sucedido, redireciona para a página Home (ou outra página)
            navigate('/home');  // Substitua '/home' pelo caminho que você deseja
        } catch (err) {
            setError('Falha ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuário" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
