import { debugLog } from './debug.js';

// Función para cargar las rutas
export async function loadRoutes() {
  try {
    const response = await fetch('/api/routes');
    const routes = await response.json();

    debugLog(`Rutas recibidas: ${JSON.stringify(routes, null, 2)}`, 'info');

    const sidebarLinks = document.getElementById('sidebar-links');
    if (!sidebarLinks) {
      debugLog('No se encontró el contenedor #sidebar-links', 'error');
      return;
    }

    sidebarLinks.innerHTML = '';
    const menu = generateRouteList(routes);
    sidebarLinks.appendChild(menu);

    debugLog('Menú lateral generado correctamente.', 'info');
  } catch (err) {
    debugLog(`Error al cargar rutas: ${err.message}`, 'error');
  }
}
function generateRouteList(routes, level = 0) {
  const ul = document.createElement('ul');
  ul.classList.add(`level-${level}`); // Para agregar estilos específicos por nivel

  routes.forEach((route) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title || 'Sin título';
    li.appendChild(a);

    // Si tiene subrutas, hacer que sea "expandible"
    if (route.children && route.children.length > 0) {
      debugLog(
        `Ruta ${route.path} tiene ${route.children.length} subrutas. Generando submenú...`,
        'info'
      );

      // Crear un contenedor para el submenú
      const subMenu = generateRouteList(route.children, level + 1);
      subMenu.style.display = 'none'; // Inicialmente ocultamos el submenú

      // Crear el evento de clic para expandir/colapsar
      a.style.cursor = 'pointer'; // Hacer que la ruta principal parezca clickeable
      a.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar que la página se recargue
        const isVisible = subMenu.style.display === 'block'; // Comprobar si el submenú está visible
        subMenu.style.display = isVisible ? 'none' : 'block'; // Alternar la visibilidad
      });

      // Añadir el submenú al padre
      li.appendChild(subMenu);
    }

    ul.appendChild(li);
  });

  return ul;
}
