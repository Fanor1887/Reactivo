import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: 'Login exitoso', user: { username: user.username } });
    });
  })(req, res, next);
});

// Registro
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password, roles: ['user'] });
    await user.save();
    res.json({
      message: 'Usuario registrado con éxito.',
      user: { username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta pública para menú
router.get('/routes', (req, res) => {
  const routes = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../config/routes.json'))
  );

  const extractRoutesTree = (routesArray, parentPath = '') => {
    return routesArray.map((route) => {
      // Corregir la concatenación de las rutas
      let fullPath = parentPath;
      if (route.path.startsWith('/')) {
        // Si la ruta comienza con '/', solo concatenamos el path sin añadir barra extra
        fullPath += route.path;
      } else {
        // Si la ruta no comienza con '/', entonces añadimos '/' antes de la ruta
        fullPath += '/' + route.path;
      }

      const result = {
        path: fullPath,
        view: route.view,
        private: route.private,
        title: route.title,
        mdname: route.mdname || '',
      };

      if (route.children) {
        result.children = extractRoutesTree(route.children, fullPath); // Pasar el fullPath correcto
      }

      return result;
    });
  };

  const allRoutes = extractRoutesTree(routes); // Usar la función corregida
  const userLogged = !!req.user;
  const filtered = allRoutes.filter((r) =>
    userLogged ? r.private : !r.private
  );

  res.json(filtered);
});

export default router;
