import express, { Router } from 'express';
import * as pageController from '../controllers/pageController';

const router: Router = express.Router();

// Páginas públicas
router.get('/',              pageController.home);
router.get('/comofunciona',  pageController.comoFunciona);
router.get('/comprarbots',   pageController.comprarBots);
router.get('/politica',      pageController.politica);

// Meus Bots (usuário logado)
router.get('/meus-bots',     pageController.meusBots);
router.post('/meus-bots',    pageController.selecionarPlano);

// Admin
router.get('/admin',                  pageController.adminLoginPage);
router.post('/admin',                 pageController.adminLogin);
router.get('/admin/pedidos',          pageController.adminPedidos);
router.post('/admin/pedidos/status',  pageController.adminAtualizarStatus);
router.get('/admin/logout',           pageController.adminLogout);

export default router;
