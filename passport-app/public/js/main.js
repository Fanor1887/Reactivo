// main.js

import { loadRoutes } from './api/index.js';
import { appBarConfig } from './components/dynamic/config/appBarConfig.js';
import { loadPage } from './contentLoad.js';
import { createDebugUI } from './debug.js';
import { initAppBar } from './init/initAppBar.js';

const appRoutes = [
  { path: '/home', title: 'Inicio' },
  { path: '/profile', title: 'Perfil' },
  { path: '/settings', title: 'Ajustes' }
];
window.addEventListener('DOMContentLoaded', () => {
  createDebugUI();
  loadRoutes();
 // Configuración inicial
// Configuración inicial

// Inicialización (puede usar ID o clase)
initAppBar('appHeader', appBarConfig); // Busca #appHeader o .appHeader
// O también: initAppBar(document.querySelector('.header-container'), appBarConfig);
  
  function createLogo() {
    const logo = document.createElement('div');
    logo.textContent = '🌀 MiApp';
    return logo;
  }
  
  function createNavMenu() {
    const nav = document.createElement('nav');
    nav.style.display = 'flex';
    nav.style.gap = '20px';
    ['Inicio', 'Productos', 'Contacto'].forEach(item => {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = item;
      link.style.color = 'white';
      link.style.textDecoration = 'none';
      nav.appendChild(link);
    });
    return nav;
  }
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