// main.js

import { loadRoutes } from './routes.js';
import { loadPage } from './contentLoader.js';
import { createDebugUI } from './debug.js';

document.addEventListener('DOMContentLoaded', () => {
  createDebugUI(); // Inicializa el botón y consola de debug
  // Cargar las rutas al inicio
  loadRoutes();

  // Delegar clicks en los enlaces
  document
    .getElementById('sidebar-links')
    .addEventListener('click', (event) => {
      const target = event.target;
      if (
        target.tagName === 'A' &&
        target.getAttribute('href').startsWith('/')
      ) {
        event.preventDefault();
        const path = target.getAttribute('href');
        loadPage(path);
      }
    });

  // Navegación con botones del navegador (atrás/adelante)
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.path) {
      loadPage(event.state.path);
    }
  });
});
