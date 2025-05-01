export async function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');

  const isActive = sidebar.classList.toggle('active');

  if (window.innerWidth > 768) {
    // 💻 Escritorio: solo mueve el contenido
    main.classList.toggle('shifted', isActive);

    // ❌ NO agregamos evento de cerrar con clic afuera
    return;
  }

  // 📱 Mobile: quitar shift y permitir cerrar con clic fuera
  main.classList.remove('shifted');

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

  // Solo cerrar si no se hace clic dentro del sidebar ni en el botón de toggle
  if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
    sidebar.classList.remove('active');
    main.classList.remove('shifted');
    document.removeEventListener('click', handleOutsideClick);
  }
}
