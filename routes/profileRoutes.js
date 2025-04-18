import express from 'express';
const router = express.Router();
import profileController from '../controllers/profileController.js';

// Rutas de perfil
router.get('/showProfile', profileController.showProfile); // Vista del perfil
router.get('/profile', profileController.getProfile); // Obtener datos del perfil (API)
router.put('/updateProfile', profileController.updateProfile); // Actualizar perfil (API)

export default router;
