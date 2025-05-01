import { setupDashboardPage } from './controllers/dashboard.js';
import { setupHomePage } from './controllers/home.js';
import { debugLog } from './debug.js';

const controllers = {
  '/dashboard': setupDashboardPage,
  '/home': setupHomePage,
};

// Función para cargar contenido de páginas sin recarga
export async function loadPage(path) {
  try {
    debugLog(`Intentando cargar la ruta: ${path}`, 'info');

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`No se pudo cargar la página: ${path}`);
    }

    const page = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(page, 'text/html');
    const newContent = doc.getElementById('content');

    if (!newContent) {
      throw new Error('No se encontró el elemento con id="content" en la respuesta');
    }

    const mainContent = document.getElementById('content');
    mainContent.innerHTML = newContent.innerHTML;

    if (controllers[path]) {
      debugLog(`Ejecutando controlador para: ${path}`, 'info');
      controllers[path]();
    } else {
      debugLog(`No hay controlador definido para: ${path}`, 'warn');
    }

    history.pushState({ path }, '', path);
    debugLog(`Ruta ${path} cargada y agregada al historial`, 'info');
  } catch (err) {
    debugLog(`Error en loadPage: ${err.message}`, 'error');
  }
}

// Ejecutar carga inicial según ruta actual
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  loadPage(currentPath);
});
