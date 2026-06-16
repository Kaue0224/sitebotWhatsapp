import express, { Express } from 'express';
import path from 'path';
import session from 'express-session';
import sequelize from './config/database';
import './models/User';
import './models/Bot';
import './models/Pedido';
import authRoutes from './routes/authRoutes';
import pageRoutes from './routes/pageRoutes';

const app: Express = express();
const PORT: number = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'sua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use('/', pageRoutes);
app.use('/', authRoutes);

sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}).catch((erro) => {
  console.error('Erro ao sincronizar banco:', erro);
});
