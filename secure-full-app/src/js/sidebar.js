// setupSidebar.js
export function setupSidebar(routes) {
  const menuList = document.getElementById('sidebar');
  menuList.innerHTML = ''; // Limpiar antes de cargar

  const nav = document.createElement('nav');
  nav.className = 'sidebar-content';

  // Función recursiva para construir el menú
  const buildMenu = (routes) => {
    const ul = document.createElement('ul');

    routes.forEach((route) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = route.path;
      a.textContent = route.title;
      li.appendChild(a);

      // Si la ruta tiene subrutas, las agregamos recursivamente
      if (route.subroutes && route.subroutes.length > 0) {
        const subMenu = buildMenu(route.subroutes); // Llamada recursiva para las subrutas
        li.appendChild(subMenu); // Agregamos las subrutas al li
      }

      ul.appendChild(li);
    });

    return ul; // Devolvemos la lista de rutas/subrutas
  };

  // Construir el menú con las rutas y subrutas
  nav.appendChild(buildMenu(routes));

  // Finalmente, agregar el nav completo al menú principal
  menuList.appendChild(nav);
}
