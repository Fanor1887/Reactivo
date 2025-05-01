import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import sessionConfig from './config/session.js';
import { getRoutes, getPage } from './controllers/routesController.js';
import { login, logout } from './controllers/authController.js';
import crypto from 'crypto';
import helmet from 'helmet';
dotenv.config();
const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

// Configuración de Nunjucks
nunjucks.configure(path.join(__dirname, 'src', 'views'), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production',
});

// Archivos estáticos desde 'd
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware de sesión
app.use(sessionConfig);

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Parsear cuerpo de la solicitud
app.use(express.urlencoded({ extended: false }));

// Rutas de la API
app.get('/api/routes', getRoutes);
app.get('/api/page', getPage);

// Autenticación
app.post('/login', login);
app.get('/logout', logout);
// Usar Helmet para mejorar la seguridad
app.use(helmet());

// Servir archivos estáticos desde 'public'

// Generar nonce para CSP

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
app.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  } else {
    return res.redirect('/home');
  }
});
// Catch-all: renderiza layout base (SPA)
app.get('*', (req, res) => {
  res.render('layout.njk', {
    // title: 'Mi Aplisadasdasdcación',
    nonce: res.locals.nonce,
    scriptPath:
      process.env.NODE_ENV === 'production' ? 'bundle.min.js' : 'main.js',
    env: JSON.stringify({ NODE_ENV: process.env.NODE_ENV }),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
