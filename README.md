# SiteBot WhatsApp

Sistema web para venda e gerenciamento de bots de WhatsApp com IA. A plataforma permite que usuários se cadastrem, escolham um plano de bot e acompanhem seus pedidos, enquanto administradores gerenciam as solicitações através de um painel próprio.

##  Funcionalidades

- **Cadastro e login de usuários** com senha criptografada (bcrypt)
- **Página institucional** apresentando o serviço e como ele funciona
- **Catálogo de planos** de bots (Básico, Profissional e Enterprise)
- **Área "Meus Bots"** para o usuário logado escolher um plano e acompanhar o status do pedido
- **Painel administrativo** separado, para visualizar todos os pedidos e atualizar seus status (pendente, confirmado, cancelado)
- **Persistência em banco de dados SQLite**, sem necessidade de configurar um servidor de banco externo

##  Tecnologias

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/) — servidor e rotas
- [EJS](https://ejs.co/) — templates das páginas
- [Sequelize](https://sequelize.org/) — ORM
- [SQLite](https://www.sqlite.org/) — banco de dados
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — hash de senhas
- [express-session](https://www.npmjs.com/package/express-session) — sessão de login

##  Estrutura do projeto

```
sitebotWhatsapp/
├── database/
│   └── database.sqlite        # banco de dados SQLite
├── public/
│   └── css/                   # arquivos de estilo
├── src/
│   ├── config/
│   │   └── database.ts        # configuração da conexão com o Sequelize
│   ├── controllers/
│   │   ├── authController.ts  # login, registro e logout
│   │   └── pageController.ts  # páginas públicas, "Meus Bots" e admin
│   ├── models/
│   │   ├── User.ts            # modelo de usuário
│   │   ├── Bot.ts             # modelo de bot
│   │   └── Pedido.ts          # modelo de pedido/plano contratado
│   ├── routes/
│   │   ├── authRoutes.ts      # rotas de autenticação
│   │   └── pageRoutes.ts      # rotas de páginas e admin
│   ├── views/                 # templates EJS (páginas + partials)
│   └── server.ts              # ponto de entrada da aplicação
├── package.json
└── tsconfig.json
```

##  Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (recomendado v18 ou superior)
- npm (já vem junto com o Node.js)

##  Como executar

Clone o repositório:

```bash
git clone https://github.com/Kaue0224/sitebotWhatsapp.git
cd sitebotWhatsapp
```

Instale as dependências:

```bash
npm install
```

Compile o projeto TypeScript:

```bash
npm run build
```

Inicie o servidor:

```bash
npm start
```

A aplicação estará disponível em:

```
http://localhost:3000
```

>  Durante o desenvolvimento, você também pode usar `npm run dev`, que compila e inicia o servidor em sequência.

##  Rotas principais

| Rota | Método | Descrição |
|---|---|---|
| `/` | GET | Página inicial |
| `/comofunciona` | GET | Página explicando o funcionamento do serviço |
| `/comprarbots` | GET | Catálogo de bots/planos |
| `/politica` | GET | Política de privacidade |
| `/login` | GET / POST | Login do usuário |
| `/registro` | GET / POST | Cadastro de novo usuário |
| `/logout` | GET | Encerra a sessão do usuário |
| `/meus-bots` | GET / POST | Área do usuário logado para escolher/acompanhar plano |
| `/admin` | GET / POST | Login do painel administrativo |
| `/admin/pedidos` | GET | Lista de pedidos (admin) |
| `/admin/pedidos/status` | POST | Atualiza o status de um pedido (admin) |
| `/admin/logout` | GET | Encerra a sessão do admin |

##  Acesso administrativo

O painel admin usa um usuário e senha fixos, definidos diretamente no código (`src/controllers/pageController.ts`):

```
Usuário: root
Senha: root
```

##  Antes de colocar em produção

Este projeto está configurado para uso local/demonstração. Antes de publicar em um ambiente real, é recomendado:

- Mover a credencial do admin e a chave de sessão (`secret` em `server.ts`) para variáveis de ambiente (`.env`), em vez de deixá-las fixas no código
- Trocar a credencial padrão do admin (`root`/`root`) por uma senha forte
- Ativar `cookie.secure: true` na sessão ao rodar sob HTTPS
- Considerar migrar de SQLite para um banco mais robusto (PostgreSQL/MySQL) caso o volume de usuários cresça


