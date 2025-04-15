import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

// Cargar variables de entorno
dotenv.config();

// Crear una instancia de Express
const app = express();
const port = process.env.PORT || 3000;

// Definir __dirname en un entorno ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware personalizado para registrar cada solicitud de archivo estático
app.use((req, res, next) => {
  if (req.url.startsWith('/public')) {
    console.log(`Archivo solicitado: ${req.url}`);
  }
  next();
});

app.use(express.json());
app.use(cors()); // Permitir todas las peticiones CORS

// Configuración de Nunjucks
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
});

// Leer rutas desde el archivo JSON de configuración
const routes = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config/routes.json'), 'utf-8')
);

// API para obtener las rutas
app.get('/api/routes', (req, res) => {
  console.log('Solicitando las rutas...');
  res.json({ routes: routes.map(({ template, ...rest }) => rest) });
});

// API para obtener usuarios
const getUsers = () => {
  const filePath = path.join(__dirname, 'data/users.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

app.get('/api/users', (req, res) => {
  const users = getUsers();
  console.log('Usuarios cargados:', users);
  res.json(users);
});

// Crear rutas dinámicas basadas en el archivo de rutas
routes.forEach(({ path: routePath, title, template }) => {
  console.log(`Creando ruta: ${routePath} con plantilla: ${template}`);
  app.get(routePath, (req, res) => {
    res.render(template, { title });
  });
});

// Servir el servidor
app.listen(port, () => {
  console.log(`✅ Servidor activo en http://localhost:${port}`);
});
