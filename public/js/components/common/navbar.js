import { toggleSidebar } from '../../utils/index.js';
import { loadContent } from '../../utils/storageUtils.js';

export function renderNavbar(routes) {
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = '';

  const leftContainer = document.createElement('div');
  leftContainer.className = 'navbar-left';

  const menuBtn = document.createElement('button');
  menuBtn.className = 'menu-toggle';
  menuBtn.innerHTML = '&#9776;';
  menuBtn.addEventListener('click', toggleSidebar);
  leftContainer.appendChild(menuBtn);

  const ul = document.createElement('ul');
  ul.className = 'navbar-list';

  routes.forEach((route) => {
    const li = document.createElement('li');
    li.className = 'navbar-item';

    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title;
    a.className = 'navbar-link';

    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadContent(route);
      if (window.innerWidth <= 768) toggleSidebar();
    });

    li.appendChild(a);
    ul.appendChild(li);
  });

  navbar.appendChild(leftContainer);
  navbar.appendChild(ul);
}
