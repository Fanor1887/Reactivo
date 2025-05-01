import { debugLog } from "../debug.js";
import { generateRouteList } from "../routes.js";

export async function loadRoutes() {
  try {
    const response = await fetch('/api/routes');
    const routes = await response.json();

    debugLog(`Rutas recibidas: ${JSON.stringify(routes, null, 2)}`, 'info');

    const sidebarLinks = document.getElementById('sidebar-links');
    if (!sidebarLinks) {
      debugLog('No se encontró el contenedor #sidebar-links', 'error');
      return;
    }

    sidebarLinks.innerHTML = '';
    const menu = generateRouteList(routes);
    sidebarLinks.appendChild(menu);

    debugLog('Menú lateral generado correctamente.', 'info');
  } catch (err) {
    debugLog(`Error al cargar rutas: ${err.message}`, 'error');
  }
}
