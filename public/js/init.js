// init.js
import { renderFooter } from './components/common/footer.js';
import { renderNavbar } from './components/common/navbar.js';
import { renderSidebar } from './components/common/sidebar.js';
import { loadRoutes, loadContent } from './utils/storageUtils.js';
import { store } from './store/index.js';

const footerLinks = [
  { label: 'Acerca de', url: '/about' },
  { label: 'Contacto', url: '/contact' },
  { label: 'Términos', url: '/terms' },
  { label: 'Privacidad', url: '/privacy' },
];

export async function init() {
  try {
    const routes = await loadRoutes(); // Obtener las rutas desde el servidor

    // Renderizar navbar, sidebar, footer
    renderNavbar(routes);
    renderSidebar(routes);
    renderFooter(footerLinks);

    // Obtener ruta actual desde la URL
    const currentPath = window.location.pathname;

    // Buscar esa ruta en las definidas
    const route = routes.find((r) => r.path === currentPath) || routes[0];

    // Establecer en el store
    store.dispatch({ type: 'SET_ROUTE', payload: route.path });

    // Guardar en localStorage (opcional)
    localStorage.setItem('currentRoute', route.path);

    // Cargar el contenido según la ruta actual
    await loadContent(route, false);
  } catch (err) {
    console.error('❌ Error al cargar las rutas o el contenido:', err);
  }
}
