import { adjustContent } from '../../utils/ajust.js';

export function createToggleIcon(navbar) {
  // Crear el nuevo icono flotante para ocultar/mostrar la navbar
  const navbarToggleIcon = document.createElement('span');
  navbarToggleIcon.innerHTML = '🔼'; // Inicialmente la flecha hacia arriba (navbar visible)
  navbarToggleIcon.style.position = 'fixed';
  navbarToggleIcon.style.top = '10px';
  navbarToggleIcon.style.right = '15px';
  navbarToggleIcon.style.cursor = 'pointer';
  navbarToggleIcon.style.fontSize = '20px';
  navbarToggleIcon.style.background = 'rgba(0, 0, 0, 0.7)';
  navbarToggleIcon.style.color = 'white';
  navbarToggleIcon.style.padding = '5px 10px';
  navbarToggleIcon.style.borderRadius = '5px';
  navbarToggleIcon.style.zIndex = '1100';
  document.body.appendChild(navbarToggleIcon);

  // Lógica para mostrar/ocultar la navbar
  navbarToggleIcon.addEventListener('click', () => {
    const isNavbarVisible = navbar.style.display !== 'none';

    if (isNavbarVisible) {
      navbar.style.display = 'none'; // Ocultar la navbar
      navbarToggleIcon.innerHTML = '🔽'; // Cambiar a la flecha hacia abajo
    } else {
      navbar.style.display = 'flex'; // Mostrar la navbar
      navbarToggleIcon.innerHTML = '🔼'; // Cambiar a la flecha hacia arriba
    }
    adjustContent();
  });

  return navbarToggleIcon;
}
