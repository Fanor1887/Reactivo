import { loadContent, loadRoutes } from './utils/storageUtils.js';
import { store } from './store/index.js';

let unsubscribe;

export async function init() {
  try {
    const routes = await loadRoutes();

    if (!routes || routes.length === 0) {
      console.error('❌ No se encontraron rutas.');
      return;
    }

    store.dispatch({ type: 'SET_ROUTES', payload: routes });

    // 🚦 Ruta actual
    const currentRoute = window.location.pathname;
    const route = routes.find((r) => r.path === currentRoute) || routes[0];

    store.dispatch({ type: 'SET_ROUTE', payload: route.path });
    localStorage.setItem('currentRoute', route.path);
    loadContent(route, false);
  } catch (err) {
    console.error('❌ Error en init():', err);
  }
}
