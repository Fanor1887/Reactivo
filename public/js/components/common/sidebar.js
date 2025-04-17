import { toggleSidebar } from '../../utils/index.js';
import { loadContent } from '../../utils/storageUtils.js';

export function renderSidebar(routes) {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = ''; // Limpiar

  // 🔹 Toolbar del sidebar (parte superior)
  const toolbar = document.createElement('div');
  toolbar.className = 'sidebar-toolbar';
  toolbar.textContent = 'Menú'; // Aquí puedes poner un logo, usuario, etc.

  // 🔹 Contenedor de links (contenido del sidebar)
  const nav = document.createElement('nav');
  nav.className = 'sidebar-content';

  const ul = document.createElement('ul');
  ul.className = 'sidebar-list';

  routes.forEach((route) => {
    const li = document.createElement('li');
    li.className = 'sidebar-item';

    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title;
    a.className = 'sidebar-link';

    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadContent(route);
      //   if (window.innerWidth <= 768) {
      toggleSidebar(); // Esto cierra el sidebar
      //   }
    });

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  // 🔹 Footer del sidebar
  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  footer.textContent = '© 2025 Tu App';

  // 🔹 Añadir todo al sidebar
  sidebar.appendChild(toolbar);
  sidebar.appendChild(nav);
  sidebar.appendChild(footer);
}
