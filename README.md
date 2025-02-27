# SóPapo – Aplicação de chat de conversas baseado no whatsApp

# Descrição:

SóPapo é uma plataforma de mensagens em tempo real desenvolvida com Flask no backend e React.js no frontend. O sistema permite comunicação em grupos de estudo, trabalho ou lazer, com recursos como criação de salas, troca de mensagens, compartilhamento de arquivos e mais.

# Estrutura do projeto:
Notas: os componentes do projeto sem comentário são o que não conseguir implementar.
E as os componentes (desabilitado) sãos pages que retirei do projeto, por acabar implementado de outra forma.

```
src --------------------------------------raiz do projeto
├── App.js--------------------------------rotas da aplicação
├── App.test.js
├── components
│   ├── ChatRoom.js
│   ├── MessageInput.js
│   └── Navbar.js-------------------------adiciona opções como logout do projeto
├── index.css
├── index.js
├── logo.svg
├── pages
│   ├── AddUserToRoom.js------------------adiciona user na room
│   ├  ── Chatroom.js----------------------principal rota do front, nele aparece a tela de chat e room
│   ├── CreateRooms.js---------------------crias as rooms no front
│   ├── DeleteUsersPage.js
│   ├── Home.js---------------------------- desabilitado
│   ├── Login.js---------------------------entra no sistema com nome e senha
│   ├── ProfilePage.js--------------------- desabilitado
│   ├── Register.js------------------------faz o register no sistema
│   ├── RemoverUserRoom.js------------------desabilitado 
│   └── styles
│       └── CreateRooms.css
├── reportWebVitals.js
├── services
│   └── api.js
└── setupTests.js
```
## 📦 Pré-requisitos
Antes de começar, você precisará ter instalado:
- [Node.js](https://nodejs.org/) (versão recomendada: 18+)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## 📥 Instalação


```
1. Clone o repositório:

Clone o projeto:  

git@github.com:lucasBalmantcoder/soPapo_frontEnd.git

git clone https://github.com/lucasBalmantcoder/soPapo_frontEnd.git
cd sopapo-frontend


2. Instale as dependências:

npm install

ou, se estiver usando Yarn:

yarn install


```
# ▶️ Rodando a Aplicação

Após instalar as dependências, execute o seguinte comando para iniciar o projeto em modo de desenvolvimento:

npm start

ou

yarn start

```
# O frontend estará disponível em:

📍 http://localhost:3000/

# Como rodar o projeto de frontend;
```
1. Execute a api, usando o comand flask run.
2. Execute o frontend, usando o comando npm start.
3. irá abri no navegador.
4. faça o register de user, com as seguintes informações.
    └── Nome :de user
    └── Email: no seguinte formato: ex: example@email.com
    └── Senha: qualquer password numeral ou string: ex: 123 ou abc
    └── Repita a senha: o mesmo password.
    └── Clique em criar conta.
5. após o login, a aba de chat abrira, escolha uma sala, e mande msg.
6. para fazer teste é legal, abrir outro navegador para mandar msg de um navegador para outro.

```

