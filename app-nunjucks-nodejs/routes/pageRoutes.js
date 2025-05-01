import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import fs from 'fs';

const router = express.Router();

// Cargar rutas desde routes.json
let routesData = { routes: [] };
try {
  routesData = JSON.parse(fs.readFileSync('routes.json', 'utf-8'));
} catch (error) {
  console.error('⚠️ Error al cargar routes.json:', error.message);
}

// Función recursiva para configurar rutas y subrutas
const configureRoutes = (routes) => {
  routes.forEach((route) => {
    // Verificamos si es una ruta privada o pública y configuramos la autenticación
    if (route.private) {
      router.get(route.path, isAuthenticated, (req, res) =>
        handleRoute(req, res, route)
      );
    } else {
      router.get(route.path, (req, res) => handleRoute(req, res, route));
    }

    // Si la ruta tiene subrutas, configurarlas también de forma recursiva
    if (route.subroutes) {
      configureRoutes(route.subroutes);
    }
  });
};

// Función para manejar las rutas
const handleRoute = (req, res, route) => {
  const currentPath = req.path;

  // Verificar si la ruta es privada y si el usuario tiene un rol que coincida
  if (route.private) {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    // Verificar si el usuario tiene al menos uno de los roles necesarios
    if (
      route.roleAlias &&
      !route.roleAlias.some((roleAlias) =>
        req.session.user.roles.includes(roleAlias)
      )
    ) {
      return res.status(403).send('Acceso denegado');
    }
  }

  // Si la solicitud es para JSON
  if (req.headers.accept?.includes('application/json')) {
    return res.json({
      title: route.title,
      path: route.path,
      routes: routesData.routes.filter((r) => !r.private || req.session.user),
    });
  }

  // Si la solicitud es HTML, se renderiza la vista
  return res.render(route.view, {
    title: route.title,
    routes: routesData.routes.filter((r) => !r.private || req.session.user),
    currentPath,
  });
};

// Configurar todas las rutas y subrutas recursivamente
configureRoutes(routesData.routes);

export default router;
