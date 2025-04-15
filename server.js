import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar Nunjucks
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Leer rutas desde JSON
const routes = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config/routes.json'), 'utf-8')
);

// API para frontend
app.get('/api/routes', (req, res) => {
  // devolvemos sin el campo template (opcional)
  res.json({ routes: routes.map(({ template, ...rest }) => rest) });
});
const getUsers = () => {
  const filePath = path.join(__dirname, 'data/users.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Crear rutas dinámicas
routes.forEach(({ path: routePath, title, template }) => {
  app.get(routePath, (req, res) => {
    res.render(template, { title });
  });
});
app.get('/api/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});

// Servidor activo
app.listen(port, () => {
  console.log(`✅ Servidor activo en http://localhost:${port}`);
});
