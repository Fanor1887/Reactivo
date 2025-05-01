// contentLoader.js
import { setupLoginPage } from './controllers/login.js';
import { setupHomePage } from './controllers/home.js';
import { debugLog } from './debug.js';

const controllers = {
  '/login': setupLoginPage,
  '/': setupHomePage,
};

export async function loadPage(path) {
  try {
    debugLog(`Iniciando carga de: ${path}`, 'info'); // 🧭 Info inicial

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`No se pudo cargar la página: ${path}`);
    }

    const page = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(page, 'text/html');
    const newContent = doc.getElementById('content');

    if (!newContent) {
      throw new Error(
        'No se encontró el elemento con id="content" en la respuesta'
      );
    }

    // Extraer el nonce
    const nonce = doc
      .querySelector('meta[name="nonce"]')
      ?.getAttribute('content');
    if (nonce) {
      document.querySelector('script').setAttribute('nonce', nonce);
      debugLog(`Nonce actualizado: ${nonce}`, 'log'); // ✅ Confirmación nonce
    } else {
      debugLog("No se encontró el meta tag 'nonce'", 'warn'); // ⚠️ Advertencia
    }

    const mainContent = document.getElementById('content');
    mainContent.innerHTML = newContent.innerHTML;

    if (controllers[path]) {
      debugLog(`Ejecutando controlador para: ${path}`, 'log'); // 🧠 Ejecución de controlador
      controllers[path]();
    } else {
      debugLog(`No hay controlador para: ${path}`, 'warn'); // ⚠️ Aviso sin controlador
    }

    history.pushState({ path }, '', path);
    debugLog(`Carga de ${path} completada`, 'info'); // ✅ Fin
  } catch (err) {
    debugLog(`Error al cargar ${path}: ${err.message}`, 'error'); // ❌ Error
  }
}

// Cargar la ruta inicial
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  debugLog(`Cargando ruta inicial: ${currentPath}`, 'info');
  loadPage(currentPath);
});
