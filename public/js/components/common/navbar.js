import { store } from '../../store/index.js';
import { toggleSidebar } from '../../utils/index.js';
import { loadContent } from '../../utils/storageUtils.js';

// Renderizar el navbar basado en las rutas obtenidas desde el store
function renderNavbar(routes, parentUl) {
  const ul = parentUl || document.createElement('ul');
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

    // Activa si coincide con la ruta actual
    if (route.path === currentRoute) {
      a.classList.add('active');
    }

    a.addEventListener('click', (e) => {
      e.preventDefault();
      store.dispatch({ type: 'SET_ROUTE', payload: route.path });
      localStorage.setItem('currentRoute', route.path);
      renderNavbar(routes); // actualizar navbar completo
      loadContent(route);
    });

    li.appendChild(a);

    // Si tiene hijos, renderiza submenú recursivo
    if (route.children && route.children.length > 0) {
      const subUl = document.createElement('ul');
      subUl.className = 'navbar-sublist'; // puedes estilizar diferente
      renderNavbar(route.children, subUl);
      li.appendChild(subUl);
    }

    ul.appendChild(li);
  });

  // Si no es llamado desde dentro, agregar al navbar
  if (!parentUl) {
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = '';

    const leftContainer = document.createElement('div');
    leftContainer.className = 'navbar-left';

    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-toggle';
    menuBtn.innerHTML = '&#9776;';
    menuBtn.addEventListener('click', toggleSidebar);
    leftContainer.appendChild(menuBtn);

    navbar.appendChild(leftContainer);
    navbar.appendChild(ul);
  }
}

// Función para suscribirse al store y actualizar el navbar cuando las rutas cambien
export function subscribeNavbar(routes) {
  store.subscribe(() => {
    renderNavbar(routes); // Re-renderizar el navbar con las rutas actualizadas
  });
}
