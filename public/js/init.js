// init.js
// import { setupContent } from './components/common/content.js';
import { renderFooter } from './components/common/footer.js';
import { renderNavbar } from './components/common/navbar.js';
import { renderSidebar } from './components/common/sidebar.js';

// import { store } from './store/index.js';
// import { adjustContent } from './utils/ajustUtils.js';
import { loadRoutes, loadContent } from './utils/storageUtils.js';

// document.addEventListener('DOMContentLoaded', () => {
//   init();
//   initSpinner(store);
//   // setupContent();
//   // adjustContent();
// });
const footerLinks = [
  { label: 'Acerca de', url: '/about' },
  { label: 'Contacto', url: '/contact' },
  { label: 'Términos', url: '/terms' },
  { label: 'Privacidad', url: '/privacy' },
];
export async function init() {
  try {
    const routes = await loadRoutes(); // Obtiene las rutas desde el servidor

    renderNavbar(routes); // Poblar el navbar con las rutas
    renderSidebar(routes);
    renderFooter(footerLinks);
    await loadContent(routes[0]); // Cargar contenido de la primera ruta
  } catch (err) {
    console.error('Error al cargar las rutas:', err);
  }
}
