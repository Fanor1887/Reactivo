import { store } from '../store/index.js';
import { toggleSidebar } from '../utils/index.js';
import { loadContent } from '../utils/storageUtils.js';
import {createDynamicTreeMenu}from '../components/dynamic/treeMenu.js'

export function renderNavbar(routes) {
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = '';

  const leftContainer = document.createElement('div');
  leftContainer.className = 'navbar-left';

  const menuBtn = document.createElement('button');
  menuBtn.className = 'menu-toggle';
  menuBtn.innerHTML = '&#9776;';
  menuBtn.addEventListener('click', () => toggleSidebar('sidebar'));
  leftContainer.appendChild(menuBtn);

  const currentRoute =
    store.getState().router?.currentRoute ||
    localStorage.getItem('currentRoute');

  const menuTree = createDynamicTreeMenu(routes, {
    keyField: 'path',
    labelField: 'title',
    childrenField: 'subroutes',
    currentValue: currentRoute,
    baseClass: 'navbar',
    onItemAction: (route) => {
      store.dispatch({ type: 'SET_ROUTE', payload: route.path });
      localStorage.setItem('currentRoute', route.path);
      renderNavbar(routes);
      loadContent(route);
    }
  });

  navbar.appendChild(leftContainer);
  navbar.appendChild(menuTree);
}


export function renderSidebar(routes) {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  const toolbar = document.createElement('div');
  toolbar.className = 'sidebar-toolbar';
  toolbar.textContent = 'Menú';

  const nav = document.createElement('nav');
  nav.className = 'sidebar-content';

  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  footer.textContent = '© 2025 Tu App';

  const currentRoute =
    store.getState().router?.currentRoute ||
    localStorage.getItem('currentRoute');

  const menuTree = createDynamicTreeMenu(routes, {
    keyField: 'path',
    labelField: 'title',
    childrenField: 'subroutes',
    currentValue: currentRoute,
    baseClass: 'sidebar',
    showArrows: true,
    onItemAction: (route) => {
      store.dispatch({ type: 'SET_ROUTE', payload: route.path });
      localStorage.setItem('currentRoute', route.path);
      renderSidebar(routes); // vuelve a renderizar para actualizar clases activas
      loadContent(route);
    }
  });

  nav.appendChild(menuTree);
  sidebar.appendChild(toolbar);
  sidebar.appendChild(nav);
  sidebar.appendChild(footer);
}

export function subscribeMenu(routes) {
  store.subscribe(() => {
    renderNavbar(routes);
    renderSidebar(routes);
  });
}
