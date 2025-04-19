import { store } from '../../store/index.js';
import { toggleSidebar } from '../../utils/index.js';
import { loadContent } from '../../utils/storageUtils.js';

/**
 * Renderiza una navbar genérica con base en rutas.
 * @param {Array} routes - Rutas a renderizar.
 * @param {Object} options - Opcional. Funciones de callback o clases.
 */
export function renderNavbar(
  routes = [],
  options = {},
  containerId = 'navbar'
) {
  const { onItemClick, className = '' } = options;

  const navbar = document.getElementById(containerId);
  if (!navbar) return;

  navbar.innerHTML = '';
  navbar.className = `navbar-container ${className}`;

  const leftContainer = document.createElement('div');
  leftContainer.className = 'navbar-left';

  const menuBtn = document.createElement('button');
  menuBtn.className = 'menu-toggle';
  menuBtn.innerHTML = '&#9776;';
  menuBtn.addEventListener('click', toggleSidebar);
  leftContainer.appendChild(menuBtn);

  const ul = document.createElement('ul');
  ul.className = 'navbar-list';

  routes.forEach((route) => {
    const li = document.createElement('li');
    li.className = 'navbar-item';

    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title || route.path;
    a.className = 'navbar-link';

    a.addEventListener('click', (e) => {
      e.preventDefault();
      onItemClick ? onItemClick(route) : loadContent(route);
      if (window.innerWidth <= 768) toggleSidebar();
    });

    li.appendChild(a);
    ul.appendChild(li);
  });

  navbar.appendChild(leftContainer);
  navbar.appendChild(ul);
}

// Función para suscribirse al store y actualizar el navbar cuando las rutas cambien
export function subscribeNavbar() {
  store.subscribe(() => {
    const { routes } = store.getState().router;
    renderNavbar(routes); // Re-renderizar el navbar con las rutas actualizadas
  });
}
