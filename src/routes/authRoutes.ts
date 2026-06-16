import express, { Router } from 'express';
import * as authController from '../controllers/authController';

const router: Router = express.Router();

router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/registro', authController.registroPage);
router.post('/registro', authController.registro);
router.get('/logout', authController.logout);

export default router;
