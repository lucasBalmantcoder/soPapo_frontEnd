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



// import React, { useEffect, useState } from 'react';
// import { Button, Form, Container } from 'react-bootstrap';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     // Se o usuário voltar para a página de login, ele será deslogado
//     if (location.state?.from) {
//       localStorage.removeItem("token");
//       sessionStorage.removeItem("token");
//     }
//   }, [location]);  // <-- Correção da sintaxe

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log("Enviando login:", { username, password });
  
//     try {
//       const response = await axios.post('http://localhost:5000/login', {
//         username,
//         password,
//       });
  
//       console.log("Resposta do backend:", response.data);
//       localStorage.setItem('token', response.data.token);
//       navigate(location.state?.from || '/home');
//     } catch (err) {
//       console.error("Erro ao fazer login:", err);
//       setError('Credenciais inválidas ou erro ao fazer o login.');
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <h2 className="text-center mb-4">Login</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="formUsername" className="mb-3">
//           <Form.Label>Nome de usuário</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Digite seu nome de usuário"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="formPassword" className="mb-3">
//           <Form.Label>Senha</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Digite sua senha"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Button variant="primary" type="submit" className="w-100">
//           Entrar
//         </Button>
//       </Form>
//     </Container>
//   );
// };

// export default Login;
