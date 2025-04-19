// import { renderSidebar } from '../components/common/sidebar.js';
// import { loadRoutes } from './storageUtils.js';

// export async function toggleSidebar() {
//   const sidebar = document.getElementById('sidebar');
//   const main = document.getElementById('main');

//   const isActive = sidebar.classList.toggle('active');

//   // Desktop: mover contenido
//   if (window.innerWidth > 768) {
//     main.classList.toggle('shifted', isActive);
//   } else {
//     main.classList.remove('shifted');
//   }

//   if (isActive) {
//     // 🧱 Primero renderiza estructura base vacía
//     renderSidebar([]); // crea toolbar, sidebar-content, footer

//     // 🎯 Luego mete el spinner SOLO en .sidebar-content
//     const sidebarContent = sidebar.querySelector('.sidebar-content');
//     sidebarContent.innerHTML = ''; // limpia si hay contenido previo

//     const loader = document.createElement('div');
//     loader.style.padding = '1rem';
//     loader.style.textAlign = 'center';
//     loader.style.fontWeight = 'bold';
//     loader.style.color = '#666';
//     loader.innerText = 'Cargando menú...';

//     sidebarContent.appendChild(loader);

//     // ⌛ Carga rutas y reemplaza el contenido
//     const routes = await loadRoutes();
//     setTimeout(() => {
//       renderSidebar(routes); // vuelve a pintar con contenido
//     }, 700);

//     document.addEventListener('click', handleOutsideClick);
//   } else {
//     document.removeEventListener('click', handleOutsideClick);
//   }
// }

// function handleOutsideClick(event) {
//   const sidebar = document.getElementById('sidebar');
//   const toggleBtn = document.querySelector('.menu-toggle');
//   const main = document.getElementById('main');

//   if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
//     sidebar.classList.remove('active');
//     main.classList.remove('shifted');
//     document.removeEventListener('click', handleOutsideClick);
//   }
// }

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
