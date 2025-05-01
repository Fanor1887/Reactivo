import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Middleware auth
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

// Leer JSON de rutas
const routes = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../config/routes.json'))
);

// Función para registrar rutas de forma recursiva
const registerRoutes = (routesArray, parentPath = '') => {
  routesArray.forEach((route) => {
    // ✅ Concatenar paths correctamente
    const normalizedPath =
      parentPath + (route.path.startsWith('/') ? route.path : '/' + route.path);

    const middleware = route.private ? ensureAuth : (req, res, next) => next();

    // Logout
    if (route.path === '/logout') {
      router.get(normalizedPath, ensureAuth, (req, res, next) => {
        req.logout((err) => {
          if (err) return next(err);
          res.redirect('/login');
        });
      });
    } else {
      // Ruta normal
      router.get(normalizedPath, middleware, (req, res) =>
        res.render(route.view, { user: req.user })
      );
    }

    // Registrar hijos
    if (route.children) {
      registerRoutes(route.children, normalizedPath);
    }
  });
};

registerRoutes(routes);

// Ruta raíz redirige según login
router.get('/', (req, res) =>
  req.user ? res.redirect('/dashboard') : res.redirect('/home')
);

// Fallback si no existe la ruta
// router.get('*', (req, res) => {
//   res.render('layout.njk', {
//     title: 'Mi Aplicación',
//     user: req.user || null,
//   });
// });

export default router;
