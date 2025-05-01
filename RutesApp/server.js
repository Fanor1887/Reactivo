const express = require('express');
const nunjucks = require('nunjucks');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const { registerRoutes } = require('./utils/routes'); // Importamos la función desde utils.js

const app = express();
const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');

// Configuración de Nunjucks
nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
});

// Usar Helmet para mejorar la seguridad
app.use(helmet());

// Servir archivos estáticos desde 'public'
app.use(express.static(publicDir));

// Generar nonce para CSP
const crypto = require('crypto');

app.use((req, res, next) => {
  // Generar un nonce seguro con SHA256
  const nonce = crypto.randomBytes(16).toString('base64'); // 16 bytes aleatorios
  res.locals.nonce = nonce;
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}';`
  );
  next();
});
// Cargar rutas desde JSON
const routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.json')));

// Registrar las rutas
registerRoutes(app, routes); // Usamos la función importada

// API para frontend
app.get('/api/routes', (req, res) => {
  res.json(routes);
});

// Página de inicio

app.get('/', (req, res) => {
  res.render('layout.njk', {
    title: 'Mi Aplicación',
    nonce: res.locals.nonce,
  });
});
// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
