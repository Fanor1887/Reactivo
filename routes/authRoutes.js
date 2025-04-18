import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';

// Rutas de autenticación
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Ruta para registro
router.post('/register', authController.register); // Ruta para registrar un nuevo usuario

export default router;
