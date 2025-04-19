import { loginFailure, loginSuccess, logout } from '../actions/authActions.js';
import { store } from '../store/index.js';
import { loadContent, loadRoutes } from '../utils/storageUtils.js';
import { subscribeSidebar } from '../components/common/sidebar.js';
import { subscribeNavbar } from '../components/common/navbar.js';
import { apiFetch } from './apiFetch.js';

export const asyncAuth = async (values) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      store.dispatch(loginFailure(data.error));
      return { success: false, error: data.error };
    }

    // ✅ Guardar sesión
    const userRoles = data.user.roles || [];
    localStorage.setItem('userRoles', JSON.stringify(userRoles));
    localStorage.setItem('isAuthenticated', data.isAuthenticated);

    store.dispatch(loginSuccess(data.user));

    // ✅ Cargar todas las rutas desde el backend o archivo
    const allRoutes = await loadRoutes();

    // ✅ Filtrar rutas por roles
    const filteredRoutes = allRoutes.filter((route) => {
      return (
        !route.roles || route.roles.some((role) => userRoles.includes(role))
      );
    });

    // ✅ Actualizar store con rutas nuevas
    store.dispatch({ type: 'SET_ROUTES', payload: filteredRoutes });

    // ✅ Renderizar sidebar actualizado
    subscribeSidebar(filteredRoutes);
    subscribeNavbar(filteredRoutes);

    // ✅ Redirigir a la ruta inicial (ej: dashboard)
    const initialRoute =
      filteredRoutes.find((r) => r.path === '/dashboard') || filteredRoutes[0];
    store.dispatch({ type: 'SET_ROUTE', payload: initialRoute.path });

    localStorage.setItem('currentRoute', initialRoute.path);
    console.log('initialRoute', initialRoute);
    // ✅ Cargar contenido
    await loadContent(initialRoute, true);

    return { success: true };
  } catch (error) {
    console.error('Error de conexión:', error);
    store.dispatch(loginFailure('Error de conexión'));
    return { success: false, error: 'Error de conexión' };
  }
};

export async function logoutFromAPI() {
  try {
    console.log('Saliendo de la sesión...');

    const response = await apiFetch('/api/logout', 'POST');
    console.log('Respuesta API logout:', response);

    if (response?.success) {
      store.dispatch(logout()); // ✅ Ahora sí se dispara el reducer y limpia el estado

      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRoles');

      // Carga la página de login sin recargar todo el sitio

      const allRoutes = await loadRoutes();
      const publicRoutes = allRoutes.filter((route) => !route.roles);

      subscribeNavbar(publicRoutes);
      subscribeSidebar(publicRoutes);
      const loginRoute = allRoutes.find((r) => r.path === '/login') || {
        path: '/login',
        title: 'Login',
      };
      // Carga login sin recargar todo el sitio
      await loadContent(loginRoute);
      // Limpiar el estado relacionado con la sesión
    } else {
      throw new Error(response?.error || 'No se pudo salir de la sesión.');
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
}
