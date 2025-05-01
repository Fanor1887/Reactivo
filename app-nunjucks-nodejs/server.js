import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import { connectDB } from './config/db.js';
import sessionConfig from './config/sessionConfig.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js'
import accountRoutes from './routes/accountRoutes.js'
import crudRoutes from './routes/crudRoutes.js';
// import setupWebSocket from './webSocket.js';
// import http from 'http';

dotenv.config();

// Crear una instancia de Express
const app = express();
const port = process.env.PORT || 3000;

// Definir __dirname en un entorno ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(sessionConfig());
// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware personalizado para registrar cada solicitud de archivo estático
app.use(express.json());
app.use(cors()); // Permitir todas las peticiones CORS
connectDB();

nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
});
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  } else {
    return res.redirect('/home');
  }
});
app.use('/api',  apiRoutes,
  authRoutes,
  profileRoutes,
  accountRoutes,
  crudRoutes); // API de rutas
app.use(pageRoutes); // Rutas dinámicas
// API para obtener usuarios
app.use((req, res) => {
  if (req.headers.accept?.includes('application/json')) {
    return res.status(404).json({ error: 'Ruta no encontrada' });
  }
  res.status(404).send('<h1>404 - Página no encontrada</h1>');
});

// Servir el servidor
app.listen(port, () => {
  console.log(`✅ Servidor activo en http://localhost:${port}`);
});
