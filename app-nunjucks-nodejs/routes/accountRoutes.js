// routes/accountRoutes.js
import express from 'express';
const router = express.Router();
import accountController from '../controllers/accountController.js'; // Importamos el controlador

// Ruta para crear una cuenta asociada a un usuario específico
router.post('/create-account/:userId', accountController.createAccount);

export default router;
