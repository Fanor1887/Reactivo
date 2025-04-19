import { store } from '../../store/index.js';
import { toggleSidebar } from '../../utils/index.js';
import { loadContent } from '../../utils/storageUtils.js';

// Renderizar el navbar basado en las rutas obtenidas desde el store
export function renderNavbar(routes) {
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = '';

  const leftContainer = document.createElement('div');
  leftContainer.className = 'navbar-left';

  const menuBtn = document.createElement('button');
  menuBtn.className = 'menu-toggle';
  menuBtn.innerHTML = '&#9776;';
  menuBtn.addEventListener('click', toggleSidebar);
  leftContainer.appendChild(menuBtn);

  const ul = document.createElement('ul');
  ul.className = 'navbar-list';

  const { currentRoute } =
    store.getState().router || localStorage.getItem('currentRoute');

  routes.forEach((route) => {
    const li = document.createElement('li');
    li.className = 'navbar-item';

    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title || route.path;
    a.className = 'navbar-link';

    // ✅ Marcar como activo si coincide con la ruta actual
    if (route.path === currentRoute) {
      a.classList.add('active');
      console.log(`✅ Ruta activa detectada: ${route.path}`);
    } else {
      console.log(`❌ Ruta NO activa: ${route.path}`);
    }
    a.addEventListener('click', (e) => {
      e.preventDefault();

      store.dispatch({ type: 'SET_ROUTE', payload: route.path });
      localStorage.setItem('currentRoute', route.path);

      // Re-renderizar para que se aplique el "active"
      renderNavbar(routes);
      loadContent(route);

      // if (window.innerWidth <= 768) toggleSidebar('navbar');
    });

    li.appendChild(a);
    ul.appendChild(li);
  });

  navbar.appendChild(leftContainer);
  navbar.appendChild(ul);
}

// Función para suscribirse al store y actualizar el navbar cuando las rutas cambien
export function subscribeNavbar(routes) {
  store.subscribe(() => {
    renderNavbar(routes); // Re-renderizar el navbar con las rutas actualizadas
  });
}
