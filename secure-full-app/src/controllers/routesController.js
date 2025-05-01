// routesController.js
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from './authController.js';

const __dirname = path.resolve();

let routes;
try {
  routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.json')));
} catch (error) {
  console.error('❌ Error al cargar rutas:', error);
  process.exit(1);
}

// Buscar una ruta por path, incluyendo subrutas
const findRoute = (targetPath, routeList = routes) => {
  for (const route of routeList) {
    if (route.path === targetPath) return route;
    if (route.subroutes) {
      const found = findRoute(targetPath, route.subroutes);
      if (found) return found;
    }
  }
  return null;
};

// Filtrar rutas según auth, incluyendo subrutas
const filterRoutes = (routeList, isLoggedIn) => {
  return routeList
    .filter((route) => isLoggedIn || !route.private) // Si no logueado, solo públicas
    .map((route) => ({
      ...route,
      subroutes: route.subroutes
        ? filterRoutes(route.subroutes, isLoggedIn)
        : [],
    }));
};

// Endpoint: obtener rutas disponibles
export const getRoutes = (req, res) => {
  const isLoggedIn = isAuthenticated(req);
  const filtered = filterRoutes(routes, isLoggedIn);
  res.json(filtered);
};

// Endpoint: obtener página HTML (si está permitido)
export const getPage = (req, res) => {
  const pathParam = req.query.path;
  const route = findRoute(pathParam);
  const isLoggedIn = isAuthenticated(req);

  if (!route) {
    return res
      .status(404)
      .json({ html: '<h1>404 - Página no encontrada</h1>' });
  }

  if (route.private && !isLoggedIn) {
    return res.status(403).json({ html: '<h1>403 - Acceso denegado</h1>' });
  }

  res.render(route.view, { title: route.title }, (err, html) => {
    if (err) {
      console.error('❌ Error al renderizar vista:', err);
      return res.status(500).json({ html: '<h1>Error del servidor</h1>' });
    }
    res.json({ html });
  });
};
