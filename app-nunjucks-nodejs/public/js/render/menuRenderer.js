import { store } from '../store/index.js';
import { toggleSidebar } from '../utils/index.js';
import { loadContent } from '../utils/storageUtils.js';

function createMenuTree(
  routes,
  currentRoute,
  onClickCallback,
  level = 0,
  isSidebar = false
) {
  const ul = document.createElement('ul');
  ul.className = isSidebar
    ? level === 0
      ? 'sidebar-list'
      : 'sidebar-sublist'
    : level === 0
    ? 'navbar-list'
    : 'navbar-sublist';

  routes.forEach((route) => {
    const li = document.createElement('li');
    li.className = isSidebar ? 'sidebar-item' : 'navbar-item';

    const linkWrapper = document.createElement('div');
    linkWrapper.className = 'menu-link-wrapper';

    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title || route.path;
    a.className = isSidebar ? 'sidebar-link' : 'navbar-link';

    if (route.path === currentRoute) {
      a.classList.add('active');
    }

    a.addEventListener('click', (e) => {
      e.preventDefault();
      store.dispatch({ type: 'SET_ROUTE', payload: route.path });
      localStorage.setItem('currentRoute', route.path);
      onClickCallback(route);
    });

    linkWrapper.appendChild(a);

    // 🡺 Si tiene subrutas, agregar flecha y desplegable
    if (route.subroutes && route.subroutes.length > 0) {
      const toggleBtn = document.createElement('span');
      toggleBtn.className = 'arrow-toggle';
      toggleBtn.innerHTML = '▶';

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const subUl = li.querySelector('ul');
        const isOpen = subUl.classList.toggle('open');
        toggleBtn.innerHTML = isOpen ? '▼' : '▶';
      });

      linkWrapper.appendChild(toggleBtn);
    }

    li.appendChild(linkWrapper);

    if (route.subroutes && route.subroutes.length > 0) {
      const childMenu = createMenuTree(
        route.subroutes,
        currentRoute,
        onClickCallback,
        level + 1,
        isSidebar
      );
      li.appendChild(childMenu);
    }

    ul.appendChild(li);
  });

  return ul;
}

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

  const { currentRoute } =
    store.getState().router || localStorage.getItem('currentRoute');

  const menuTree = createMenuTree(routes, currentRoute, (route) => {
    renderNavbar(routes);
    loadContent(route);
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

  const { currentRoute } =
    store.getState().router || localStorage.getItem('currentRoute');

  const menuTree = createMenuTree(
    routes,
    currentRoute,
    (route) => {
      renderSidebar(routes);
      loadContent(route);
    },
    0,
    true
  );

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
