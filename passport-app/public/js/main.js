// main.js

import { loadRoutes } from './routes.js';
import { loadPage } from './contentLoad.js';
import { createDebugUI } from './debug.js';
import { registerGlobalEvents } from './events/globalEvents.js';
document.addEventListener('DOMContentLoaded', () => {
  // Cargar las rutas al inicio
  createDebugUI(); // Inicializa el botón y consola de debug

  loadRoutes(); // Cargar rutas

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
