import express from 'express';
import fs from 'fs';

const router = express.Router();

// Cargar rutas desde routes.json
let routesData = { routes: [] };
try {
  routesData = JSON.parse(fs.readFileSync('routes.json', 'utf-8'));
} catch (error) {
  console.error('⚠️ Error al cargar routes.json:', error.message);
}

// Función recursiva para filtrar rutas y subrutas
const filterRoutes = (routes, user) => {
  return routes
    .filter((route) => {
      // Si la ruta no tiene la propiedad 'private', debe ser accesible tanto para público como privado
      if (route.private === undefined || !route.private) {
        // Si la ruta es pública y no tiene roleAlias, solo se debe mostrar cuando el usuario no esté autenticado
        if (!route.roleAlias) {
          return !user; // Solo se muestra si el usuario no está autenticado
        }
        return true; // Si tiene roleAlias, se muestra siempre
      }

      // Si la ruta es privada pero no tiene 'roleAlias', se muestra solo si el usuario está autenticado
      if (route.private && !route.roleAlias) {
        return user ? true : false; // Solo si el usuario está autenticado
      }

      // Si la ruta tiene 'private' y 'roleAlias', verificar si el usuario está autenticado y tiene el rol adecuado
      if (route.private && route.roleAlias) {
        if (!user) {
          return false; // Si no está autenticado, no mostrar
        }

        const userRoles = user.roles || [];
        const hasValidRole = route.roleAlias.some((roleAlias) =>
          userRoles.includes(roleAlias)
        );

        return hasValidRole; // Mostrar solo si el usuario tiene un rol válido
      }

      return true; // Si no es privada, la ruta es accesible
    })
    .map((route) => {
      // Si la ruta tiene subrutas, aplicar recursión
      if (route.subroutes) {
        route.subroutes = filterRoutes(route.subroutes, user); // Filtrar subrutas recursivamente
      }
      return route;
    });
};

// Nueva API para devolver las rutas en JSON
router.get('/routes', (req, res) => {
  const user = req.session.user; // Obtén el usuario de la sesión

  // Filtrar las rutas y subrutas según el estado de autenticación y roles
  const filteredRoutes = filterRoutes(routesData.routes, user);

  // Imprimir las rutas y subrutas filtradas en la consola
  console.log('Rutas filtradas:', JSON.stringify(filteredRoutes, null, 2));

  // Devolver las rutas filtradas
  res.json({ routes: filteredRoutes });
});

export default router;
