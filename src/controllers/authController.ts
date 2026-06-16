import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// ─── Helpers ────────────────────────────────────────────────────────────────

const isEmailValido = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isSenhaForte = (senha: string): boolean =>
  senha.length >= 8;

// ─── Login ──────────────────────────────────────────────────────────────────

export const loginPage = (req: Request, res: Response): void => {
  if ((req.session as any).usuarioId) {
    res.redirect('/');
    return;
  }
  res.render('login', {
    title: 'Login',
    error: null,
    emailAnterior: '',
    campos: { nome: '', email: '' },
    usuarioId: (req.session as any).usuarioId ?? null,
    usuarioNome: (req.session as any).usuarioNome ?? null
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  // Validações básicas
  if (!email || !senha) {
    res.render('login', {
      title: 'Login',
      error: 'Email e senha são obrigatórios.',
      emailAnterior: email || '',
      usuarioId: null,
      usuarioNome: null
    });
    return;
  }

  if (!isEmailValido(email)) {
    res.render('login', {
      title: 'Login',
      error: 'Informe um email válido.',
      emailAnterior: email,
      usuarioId: null,
      usuarioNome: null
    });
    return;
  }

  try {
    const usuario = await User.findOne({ where: { email: email.toLowerCase().trim() } });

    // Mensagem genérica propositalmente para não revelar se o email existe
    if (!usuario) {
      res.render('login', {
        title: 'Login',
        error: 'Email ou senha incorretos.',
        emailAnterior: email,
        usuarioId: null,
        usuarioNome: null
      });
      return;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      res.render('login', {
        title: 'Login',
        error: 'Email ou senha incorretos.',
        emailAnterior: email,
        usuarioId: null,
        usuarioNome: null
      });
      return;
    }

    // Regenera a sessão para evitar session fixation
    req.session.regenerate((err) => {
      if (err) {
        res.render('login', {
          title: 'Login',
          error: 'Erro interno ao iniciar sessão. Tente novamente.',
          emailAnterior: email,
          usuarioId: null,
          usuarioNome: null
        });
        return;
      }

      (req.session as any).usuarioId    = usuario.id;
      (req.session as any).usuarioNome  = usuario.nome;
      (req.session as any).usuarioEmail = usuario.email;

      res.redirect('/');
    });

  } catch (erro) {
    console.error('[Login] Erro inesperado:', erro);
    res.render('login', {
      title: 'Login',
      error: 'Erro interno do servidor. Tente novamente mais tarde.',
      emailAnterior: email,
      usuarioId: null,
      usuarioNome: null
    });
  }
};

// ─── Registro ───────────────────────────────────────────────────────────────

export const registroPage = (req: Request, res: Response): void => {
  if ((req.session as any).usuarioId) {
    res.redirect('/');
    return;
  }
  res.render('registro', {
    title: 'Criar Conta',
    error: null,
    campos: { nome: '', email: '' },
    usuarioId: null,
    usuarioNome: null
  });
};

export const registro = async (req: Request, res: Response): Promise<void> => {
  const { nome, email, senha, senhaConfirm } = req.body;

  // Retorna os campos preenchidos para não forçar o usuário a redigitar tudo
  const campos = { nome: nome || '', email: email || '' };

  const renderErro = (mensagem: string): void => {
    res.render('registro', {
      title: 'Criar Conta',
      error: mensagem,
      campos,
      usuarioId: null,
      usuarioNome: null
    });
  };

  // Campos obrigatórios
  if (!nome || !email || !senha || !senhaConfirm) {
    renderErro('Todos os campos são obrigatórios.');
    return;
  }

  // Tamanho do nome
  if (nome.trim().length < 3) {
    renderErro('O nome deve ter pelo menos 3 caracteres.');
    return;
  }

  // Formato do email
  if (!isEmailValido(email)) {
    renderErro('Informe um email válido.');
    return;
  }

  // Força da senha
  if (!isSenhaForte(senha)) {
    renderErro('A senha deve ter no mínimo 8 caracteres.');
    return;
  }

  // Confirmação da senha
  if (senha !== senhaConfirm) {
    renderErro('As senhas não coincidem.');
    return;
  }

  try {
    const emailNormalizado = email.toLowerCase().trim();

    const usuarioExistente = await User.findOne({ where: { email: emailNormalizado } });

    if (usuarioExistente) {
      renderErro('Este email já está cadastrado.');
      return;
    }

    const novoUsuario = await User.create({
      nome: nome.trim(),
      email: emailNormalizado,
      senha
    });

    // Regenera a sessão para evitar session fixation
    req.session.regenerate((err) => {
      if (err) {
        renderErro('Conta criada, mas houve um erro ao iniciar sessão. Faça login manualmente.');
        return;
      }

      (req.session as any).usuarioId    = novoUsuario.id;
      (req.session as any).usuarioNome  = novoUsuario.nome;
      (req.session as any).usuarioEmail = novoUsuario.email;

      res.redirect('/');
    });

  } catch (erro: any) {
    console.error('[Registro] Erro inesperado:', erro);

    // Erro de unique constraint do Sequelize (race condition)
    if (erro.name === 'SequelizeUniqueConstraintError') {
      renderErro('Este email já está cadastrado.');
      return;
    }

    // Erro de validação do Sequelize (ex: isEmail)
    if (erro.name === 'SequelizeValidationError') {
      const mensagem = erro.errors?.[0]?.message || 'Dados inválidos.';
      renderErro(mensagem);
      return;
    }

    renderErro('Erro interno do servidor. Tente novamente mais tarde.');
  }
};

// ─── Logout ─────────────────────────────────────────────────────────────────

export const logout = (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      console.error('[Logout] Erro ao destruir sessão:', err);
      res.redirect('/');
      return;
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};
