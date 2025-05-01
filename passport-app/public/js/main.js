// main.js

import { loadRoutes } from './api/index.js';
import { loadPage } from './contentLoad.js';
import { createDebugUI } from './debug.js';

window.addEventListener('DOMContentLoaded', () => {
  createDebugUI();
  loadRoutes();

  document.getElementById('sidebar-links')?.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target && target.getAttribute('href')?.startsWith('/')) {
      e.preventDefault();
      const path = target.getAttribute('href');
      loadPage(path);
    }
  });

  window.addEventListener('popstate', (e) => {
    if (e.state?.path) loadPage(e.state.path);
  });
});