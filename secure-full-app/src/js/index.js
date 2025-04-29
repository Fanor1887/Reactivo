// index.js
import { contentLoad } from './contentLoad.js';
import { setupSidebar } from './sidebar.js';

function init() {
  fetch('/api/routes')
    .then((res) => res.json())
    .then((routes) => {
      setupSidebar(routes);

      document.getElementById('menu-list').addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href')?.startsWith('/')) {
          e.preventDefault();
          const path = link.getAttribute('href');
          history.pushState({}, '', path); // Actualizar URL
          contentLoad(path);
        }
      });

      contentLoad(window.location.pathname);
    })
    .catch((err) => {
      console.error('Error al inicializar la aplicación:', err);
    });
}

document.addEventListener('DOMContentLoaded', init);
