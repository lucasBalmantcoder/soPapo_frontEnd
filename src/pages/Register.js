import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Novo estado para mensagem de sucesso
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmedPassword) {
            setError('As senhas não coincidem!');
            return;
        }

        try {
            // Passando todos os dados para o backend
            const data = await registerUser({
                username,
                email,
                password,
                confirmed_password: confirmedPassword,
            });
            console.log('Cadastro bem-sucedido:', data);
            setSuccessMessage('Usuário criado com sucesso!'); // Exibe a mensagem de sucesso
            setError(''); // Limpa qualquer mensagem de erro

            // Após 2 segundos, redireciona para o login
            setTimeout(() => navigate('/login'), 2000); 
        } catch (err) {
            setError('Erro ao criar conta. Tente novamente.');
            setSuccessMessage(''); // Limpa a mensagem de sucesso caso haja erro
        }
    };

    return (
      <div className="container">
          <h2 className="text-center my-4">Criar Conta</h2>
          
          {/* Mensagem de sucesso */}
          {successMessage && <p className="text-success text-center">{successMessage}</p>}
          
          {/* Mensagem de erro */}
          {error && <p className="text-danger text-center">{error}</p>}
          
          <form onSubmit={handleRegister}>
              {/* Primeira Linha - Nome de Usuário e Email */}
              <div className="row mb-3">
                  <div className="col-md-6">
                      <label htmlFor="username" className="form-label">Nome de usuário</label>
                      <input 
                          type="text" 
                          className="form-control" 
                          id="username" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                          placeholder="Nome de usuário" 
                      />
                  </div>
                  <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input 
                          type="email" 
                          className="form-control" 
                          id="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="Email" 
                      />
                  </div>
              </div>

              {/* Segunda Linha - Senha e Confirmar Senha */}
              <div className="row mb-3">
                  <div className="col-md-6">
                      <label htmlFor="password" className="form-label">Senha</label>
                      <input 
                          type="password" 
                          className="form-control" 
                          id="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="Senha" 
                      />
                  </div>
                  <div className="col-md-6">
                      <label htmlFor="confirmedPassword" className="form-label">Confirmar Senha</label>
                      <input 
                          type="password" 
                          className="form-control" 
                          id="confirmedPassword" 
                          value={confirmedPassword} 
                          onChange={(e) => setConfirmedPassword(e.target.value)} 
                          placeholder="Confirmar Senha" 
                      />
                  </div>
              </div>

              {/* Botão para Criar Conta */}
              <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Criar Conta</button>
              </div>
          </form>
          <p className="text-center mt-3">
              Já tem uma conta? <button onClick={() => navigate('/login')} className="btn btn-link">Entrar</button>
          </p>
      </div>
  );
};

export default Register;
