import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';

import passport from './src/config/passport.js';
import sessionConfig from './src/config/sessionConfig.js';

dotenv.config();
const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

// 🟢 Middleware de sesión (¡Muy importante ir antes de Passport!)
app.use(sessionConfig());

// 🟢 Inicializar passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Nunjucks
nunjucks.configure(path.join(__dirname, 'src', 'views'), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production',
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.urlencoded({ extended: false }));

// Nonce para CSP
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}';`
  );
  next();
});

// Función para verificar autenticación
const isAuthenticated = (req) => req.isAuthenticated();

// Rutas JSON
let routes;
try {
  routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.json')));
} catch (error) {
  console.error('❌ Error al cargar rutas:', error);
  process.exit(1);
}

// Filtrar rutas por autenticación
// Endpoint: rutas disponibles
app.get('/api/routes', (req, res) => {
  const auth = isAuthenticated(req);
  const filtered = filterRoutes(routes, auth);
  res.json(filtered);
});

// Endpoint para login
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })
);

// Endpoint logout
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

// Ruta protegida (ejemplo)
// Render SPA
app.get('*', (req, res) => {
  res.render('layout.njk', {
    title: 'Mi App Segura',
    nonce: res.locals.nonce,
    scriptPath:
      process.env.NODE_ENV === 'production' ? 'bundle.min.js' : 'main.js',
    env: JSON.stringify({ NODE_ENV: process.env.NODE_ENV }),
  });
});
// Buscar ruta recursivamente
const findRoute = (targetPath, routeList = routes) => {
  if (targetPath === '/home') {
    return routes.find((route) => route.path === '/home');
  }

  for (const route of routeList) {
    if (route.path === targetPath) return route;
    if (route.subroutes) {
      const found = findRoute(targetPath, route.subroutes);
      if (found) return found;
    }
  }
  return null;
};

// Filtrar rutas privadas según auth
function filterRoutes(routeList, auth) {
  return routeList
    .filter((route) => !route.private || auth)
    .map((route) => ({
      ...route,
      subroutes: route.subroutes ? filterRoutes(route.subroutes, auth) : [],
    }));
}

// Endpoint: obtener rutas disponibles (según login)
app.get('/api/routes', (req, res) => {
  const auth = isAuthenticated(req);
  const filtered = filterRoutes(routes, auth);
  res.json(filtered);
});

// Endpoint para cargar contenido de la página (con auth)
app.get('/api/page', (req, res) => {
  const route = findRoute(req.query.path);
  const auth = isAuthenticated(req);

  if (!route) {
    return res
      .status(404)
      .json({ html: '<h1>404 - Página no encontrada</h1>' });
  }

  if (route.private && !auth) {
    return res.status(403).json({ html: '<h1>403 - Acceso denegado</h1>' });
  }

  res.render(route.view, { title: route.title }, (err, html) => {
    if (err) {
      console.error('❌ Error al renderizar vista:', err);
      return res.status(500).json({ html: '<h1>Error del servidor</h1>' });
    }
    res.json({ html });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
