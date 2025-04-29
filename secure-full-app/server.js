import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

// Configuración de Nunjucks
nunjucks.configure(path.join(__dirname, 'src', 'views'), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production', // Solo en desarrollo
});

// Archivos estáticos desde 'dist' (para frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Cargar rutas desde JSON
let routes;
try {
  routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.json')));
} catch (error) {
  console.error('Error al cargar rutas:', error);
  process.exit(1);
}

// Función para encontrar la ruta en routes.json
// Función para encontrar la ruta en routes.json
const findRoute = (targetPath, routeList = routes) => {
  // Si la ruta es la raíz "/home", la manejamos directamente
  if (targetPath === '/home') {
    return routes.find((route) => route.path === '/home');
  }

  // Si no es la raíz, procedemos a buscar en subrutas
  for (const route of routeList) {
    if (route.path === targetPath) return route;
    if (route.subroutes) {
      const found = findRoute(targetPath, route.subroutes);
      if (found) return found;
    }
  }
  return null; // Si no se encuentra la ruta
};

// Endpoint: devolver las rutas disponibles
app.get('/api/routes', (req, res) => {
  res.json(routes);
});
// Endpoint para la página de inicio (ruta "/home")

// Endpoint para cargar el contenido de la página
app.get('/api/page', (req, res) => {
  const route = findRoute(req.query.path);
  if (!route) {
    return res
      .status(404)
      .json({ html: '<h1>404 - Página no encontrada</h1>' });
  }

  res.render(route.view, { title: route.title }, (err, html) => {
    if (err) {
      console.error('Error al renderizar la vista:', err);
      return res.status(500).json({ html: '<h1>Error del servidor</h1>' });
    }
    res.json({ html });
  });
});

// Catch-all para SPA: sirve solo el layout base sin renderizado de vistas
app.get('*', (req, res) => {
  res.render('layout.njk', {
    title: 'Mi Aplicación',
    scriptPath:
      process.env.NODE_ENV === 'production' ? 'bundle.min.js' : 'main.js',
    env: JSON.stringify({
      NODE_ENV: process.env.NODE_ENV,
    }),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
