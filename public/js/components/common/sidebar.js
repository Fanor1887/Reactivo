import { store } from '../../store/index.js';
import { toggleSidebar } from '../../utils/index.js';
import { loadContent } from '../../utils/storageUtils.js';

export function renderSidebar(routes) {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = ''; // Limpiar

  const { currentRoute } =
    store.getState().router || localStorage.getItem('currentRoute');

  // 🔹 Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'sidebar-toolbar';
  toolbar.textContent = 'Menú';

  const nav = document.createElement('nav');
  nav.className = 'sidebar-content';

  const ul = document.createElement('ul');
  ul.className = 'sidebar-list';

  routes.forEach((route) => {
    const li = document.createElement('li');
    li.className = 'sidebar-item';

    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title;
    a.className = 'sidebar-link';

    // ✅ Activar si es la ruta actual
    if (route.path === currentRoute) {
      a.classList.add('active');
    }

    a.addEventListener('click', async (e) => {
      e.preventDefault();

      // Guardar la ruta activa
      store.dispatch({ type: 'SET_ROUTE', payload: route.path });
      localStorage.setItem('currentRoute', route.path);

      // Re-renderizar para aplicar el "active"
      renderSidebar(routes);
      await loadContent(route);

      if (window.innerWidth <= 768) {
        toggleSidebar('sidebar'); // Esto cierra el sidebar
      }
    });

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  footer.textContent = '© 2025 Tu App';

  sidebar.appendChild(toolbar);
  sidebar.appendChild(nav);
  sidebar.appendChild(footer);
}
export function subscribeSidebar(routes) {
  store.subscribe(() => {
    renderSidebar(routes); // Re-renderizar el sidebar con las rutas actualizadas
  });
}
