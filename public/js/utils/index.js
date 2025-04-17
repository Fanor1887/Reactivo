export function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');
  

  const isActive = sidebar.classList.toggle('active');

  // Solo agregar desplazamiento si NO es móvil
  if (window.innerWidth > 768) {
    if (isActive) {
      main.classList.add('shifted');
    } else {
      main.classList.remove('shifted');
    }
  } else {
    main.classList.remove('shifted'); // Asegura que en móvil nunca se mueva
  }

  if (isActive) {
    document.addEventListener('click', handleOutsideClick);
  } else {
    document.removeEventListener('click', handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.menu-toggle');
  const main = document.getElementById('main');

  if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
    sidebar.classList.remove('active');
    main.classList.remove('shifted');
    document.removeEventListener('click', handleOutsideClick);
  }
}
