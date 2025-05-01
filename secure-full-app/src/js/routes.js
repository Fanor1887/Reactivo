// loadRoutes.js
import { setupSidebar } from './sidebar.js';
import { debugLog } from './debug.js';

export function loadRoutes() {
  fetch('/api/routes', { credentials: 'include' })
    .then((res) => res.json())
    .then((routes) => {
      debugLog(`Rutas recibidas: ${routes.length}`, 'info');
      setupSidebar(routes); // Configura el sidebar con las rutas
    })
    .catch((err) => {
      debugLog(`Error al inicializar las rutas: ${err.message}`, 'error');
    });
}
