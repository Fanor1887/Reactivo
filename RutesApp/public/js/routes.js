// Función para cargar las rutas
export async function loadRoutes() {
  const response = await fetch('/api/routes');
  const routes = await response.json();
  console.log('routes', routes);

  const sidebarLinks = document.getElementById('sidebar-links');
  sidebarLinks.innerHTML = '';

  // Agrega el menú recursivamente
  const menu = generateRouteList(routes);
  sidebarLinks.appendChild(menu);
}

// Función recursiva para generar listas anidadas de rutas
function generateRouteList(routes) {
  const ul = document.createElement('ul');

  routes.forEach((route) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title;
    li.appendChild(a);

    // Si hay subrutas, agregar funcionalidad de expansión
    if (route.subroutes && route.subroutes.length > 0) {
      // Crear un contenedor para las subrutas
      const subList = generateRouteList(route.subroutes);
      subList.style.display = 'none'; // Inicialmente ocultamos las subrutas

      // Crear el evento de clic para expandir/colapsar
      a.style.cursor = 'pointer'; // Hacer que el enlace sea clickeable
      a.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar que se recargue la página
        const isVisible = subList.style.display === 'block'; // Comprobar si está visible
        subList.style.display = isVisible ? 'none' : 'block'; // Alternar la visibilidad
      });

      // Añadir el submenú al padre
      li.appendChild(subList);
    }

    ul.appendChild(li);
  });

  return ul;
}
