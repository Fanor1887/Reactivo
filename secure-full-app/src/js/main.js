import { contentLoad } from './contentLoad.js';
import { setupSidebar } from './sidebar.js';
import { debugLog, createDebugUI } from './debug.js';
import '../styles/index.css';

import { fetchData } from './api/fetcher.js'; // Asegúrate de importar la función fetchData

async function init() {
  createDebugUI();

  try {
    // Usando fetchData para obtener las rutas
    const routes = await fetchData('/api/routes', { credentials: 'include' });

    debugLog(`Rutas recibidas: ${routes.length}`, 'info');
    setupSidebar(routes); // Inicializamos el sidebar al cargar las rutas

    // Delegar el evento 'click' en los enlaces del sidebar
    setupSidebarLinks();

    // Cargar el contenido solo si no es el contenido ya cargado
    contentLoad(window.location.pathname);
  } catch (err) {
    debugLog(`Error al inicializar la aplicación: ${err.message}`, 'error');
  }

  // Soporte para botones atrás/adelante en el historial
  window.addEventListener('popstate', () => {
    contentLoad(location.pathname);
  });
}

// Función para delegar el evento click en los enlaces del sidebar
function setupSidebarLinks() {
  const menuList = document.getElementById('sidebar');
  if (menuList) {
    menuList.addEventListener('click', (e) => {
      const link = e.target;
      if (link.tagName === 'A' && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault(); // Evitar la recarga de la página
        const path = link.getAttribute('href');
        debugLog(`Navegando a: ${path}`, 'info');
        history.pushState({}, '', path); // Actualizar el historial sin recargar
        contentLoad(path); // Cargar el contenido dinámicamente
      }
    });
  }
}

// Asegúrate de que el contenido cargado no afecte al sidebar
document.addEventListener('DOMContentLoaded', init);
