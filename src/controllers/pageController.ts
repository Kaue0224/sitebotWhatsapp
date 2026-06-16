import { Request, Response } from 'express';
import Pedido from '../models/Pedido';
import User from '../models/User';

const ADMIN_USER = 'root';
const ADMIN_PASS = 'root';

const planos = [
  { id: 'basico',        nome: 'Bot Básico',        preco: 'R$ 99/mês' },
  { id: 'profissional',  nome: 'Bot Profissional',   preco: 'R$ 299/mês' },
  { id: 'enterprise',   nome: 'Bot Enterprise',     preco: 'Sob Consulta' }
];

// ─── Páginas públicas ────────────────────────────────────────────────────────

export const home = (req: Request, res: Response): void => {
  res.render('main', {
    title: 'Home',
    usuarioId:   (req.session as any).usuarioId,
    usuarioNome: (req.session as any).usuarioNome
  });
};

export const comoFunciona = (req: Request, res: Response): void => {
  res.render('comofunciona', {
    title: 'Como Funciona',
    usuarioId:   (req.session as any).usuarioId,
    usuarioNome: (req.session as any).usuarioNome
  });
};

export const comprarBots = (req: Request, res: Response): void => {
  res.render('comprarbots', {
    title: 'Bots',
    usuarioId:   (req.session as any).usuarioId,
    usuarioNome: (req.session as any).usuarioNome
  });
};

export const politica = (req: Request, res: Response): void => {
  res.render('politica', {
    title: 'Política de Privacidade',
    usuarioId:   (req.session as any).usuarioId,
    usuarioNome: (req.session as any).usuarioNome
  });
};

// ─── Meus Bots ──────────────────────────────────────────────────────────────

export const meusBots = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = (req.session as any).usuarioId;

  if (!usuarioId) {
    res.redirect('/login');
    return;
  }

  const pedidos = await Pedido.findAll({ where: { usuarioId } });
  const planoAtual = pedidos.length > 0 ? pedidos[pedidos.length - 1].plano : null;

  res.render('meusbots', {
    title: 'Meus Bots',
    usuarioId,
    usuarioNome: (req.session as any).usuarioNome,
    planos,
    planoAtual,
    sucesso: (req.session as any).sucesso || null,
    erro: (req.session as any).erroBot || null
  });

  // Limpa flash
  delete (req.session as any).sucesso;
  delete (req.session as any).erroBot;
};

export const selecionarPlano = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = (req.session as any).usuarioId;

  if (!usuarioId) {
    res.redirect('/login');
    return;
  }

  const { plano } = req.body;
  const planosValidos = ['basico', 'profissional', 'enterprise'];

  if (!planosValidos.includes(plano)) {
    (req.session as any).erroBot = 'Plano inválido.';
    res.redirect('/meus-bots');
    return;
  }

  try {
    await Pedido.create({ usuarioId, plano, status: 'pendente' });
    (req.session as any).sucesso = `Plano ${plano} selecionado! Entraremos em contato pelo WhatsApp.`;
  } catch (err) {
    console.error('[selecionarPlano]', err);
    (req.session as any).erroBot = 'Erro ao salvar pedido. Tente novamente.';
  }

  res.redirect('/meus-bots');
};

// ─── Admin ───────────────────────────────────────────────────────────────────

export const adminLoginPage = (req: Request, res: Response): void => {
  if ((req.session as any).isAdmin) {
    res.redirect('/admin/pedidos');
    return;
  }
  res.render('admin-login', {
    title: 'Admin',
    error: null,
    usuarioId: null,
    usuarioNome: null
  });
};

export const adminLogin = (req: Request, res: Response): void => {
  const { usuario, senha } = req.body;

  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    (req.session as any).isAdmin = true;
    res.redirect('/admin/pedidos');
    return;
  }

  res.render('admin-login', {
    title: 'Admin',
    error: 'Usuário ou senha incorretos.',
    usuarioId: null,
    usuarioNome: null
  });
};

export const adminPedidos = async (req: Request, res: Response): Promise<void> => {
  if (!(req.session as any).isAdmin) {
    res.redirect('/admin');
    return;
  }

  const pedidos = await Pedido.findAll({
    include: [{ model: User, attributes: ['nome', 'email'] }],
    order: [['dataCriacao', 'DESC']]
  });

  res.render('admin-pedidos', {
    title: 'Admin — Pedidos',
    pedidos,
    usuarioId: null,
    usuarioNome: 'Admin'
  });
};

export const adminAtualizarStatus = async (req: Request, res: Response): Promise<void> => {
  if (!(req.session as any).isAdmin) {
    res.redirect('/admin');
    return;
  }

  const { id, status } = req.body;
  const statusValidos = ['pendente', 'confirmado', 'cancelado'];

  if (!statusValidos.includes(status)) {
    res.redirect('/admin/pedidos');
    return;
  }

  try {
    await Pedido.update({ status }, { where: { id } });
  } catch (err) {
    console.error('[adminAtualizarStatus]', err);
  }

  res.redirect('/admin/pedidos');
};

export const adminLogout = (req: Request, res: Response): void => {
  delete (req.session as any).isAdmin;
  res.redirect('/admin');
};
