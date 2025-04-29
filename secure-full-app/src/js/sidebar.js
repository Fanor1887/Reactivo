// setupSidebar.js
export function setupSidebar(routes) {
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = ''; // Limpiar antes de cargar

  const buildMenu = (routes) => {
    const ul = document.createElement('ul');

    routes.forEach((route) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = route.path;
      a.textContent = route.title;
      li.appendChild(a);

      if (route.subroutes && route.subroutes.length > 0) {
        li.appendChild(buildMenu(route.subroutes));
      }

      ul.appendChild(li);
    });

    return ul;
  };

  menuList.appendChild(buildMenu(routes));
}
