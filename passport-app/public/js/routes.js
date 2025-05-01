import { customIcon } from './components/custom/customIcon.js';
import { debugLog } from './debug.js';
// components/menu/toggleSubMenu.js
export function toggleSubMenu(currentSubMenu, currentTriangle, parentUl) {
  // Cerrar todos los submenús del mismo nivel
  Array.from(parentUl.children).forEach((siblingLi) => {
    const siblingSubMenu = siblingLi.querySelector('ul');
    const siblingTriangle = siblingLi.querySelector('span[data-triangle]');
    if (siblingSubMenu && siblingSubMenu !== currentSubMenu) {
      siblingSubMenu.style.display = 'none';
      if (siblingTriangle) siblingTriangle.style.transform = 'rotate(0deg)';
    }
  });

  // Alternar visibilidad actual
  const isVisible = currentSubMenu.style.display === 'block';
  currentSubMenu.style.display = isVisible ? 'none' : 'block';
  currentTriangle.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
}




// routes.js



export function generateRouteList(routes, level = 0) {
  const ul = document.createElement('ul');
  ul.classList.add(`level-${level}`);

  routes.forEach((route) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.flexDirection = 'column';
    li.style.padding = '4px 10px';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.gap = '6px';

    const a = document.createElement('a');
    a.href = route.path || '#';
    a.textContent = route.title || 'Sin título';
    a.style.flexGrow = '1';
    a.style.textDecoration = 'none';
    a.style.color = '#ddd';
    a.style.display = 'flex';
    a.style.alignItems = 'center';
    a.style.gap = '6px';

    const leftIcon = customIcon('📁', 20, '#333');
    a.prepend(leftIcon);

    header.appendChild(a);

    if (route.children && route.children.length > 0) {
      const subMenu = generateRouteList(route.children, level + 1);
      subMenu.style.display = 'none';

      const triangle = document.createElement('span');
      triangle.innerHTML = '▶';
      triangle.dataset.triangle = 'true';
      triangle.style.fontSize = '14px';
      triangle.style.color = '#aaa';
      triangle.style.cursor = 'pointer';
      triangle.style.transition = 'transform 0.3s ease';

      triangle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSubMenu(subMenu, triangle, ul);
      });

      header.appendChild(triangle);
      li.appendChild(header);
      li.appendChild(subMenu);
    } else {
      li.appendChild(header);
    }

    ul.appendChild(li);
  });

  return ul;
}


