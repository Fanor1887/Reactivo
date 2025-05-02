// Simulamos el estado de autenticación
const isAuthenticated = false; // Cambia a false para probar otros estados

// Helper para verificar si es móvil
function isMobile() {
  return window.innerWidth <= 768;
}

// **Componentes reutilizables:**

function createAppBar() {
  const header = document.createElement('header');
  header.className = 'app-bar';

  const nav = document.createElement('nav');
  nav.className = 'navbar-container';

  header.appendChild(nav);
  return { header, nav };
}

function createLogo() {
  const logo = document.createElement('span');
  logo.className = 'navbar-logo';
  logo.textContent = '🌀 MiApp';
  return logo;
}

function createMenuToggleBtn() {
  const btn = document.createElement('button');
  btn.className = 'menu-toggle';
  btn.innerHTML = '&#9776;';
  btn.addEventListener('click', () => toggleSidebar('sidebar')); // Aquí va la lógica del sidebar
  return btn;
}



function renderUserPopper(container) {
  const userBtn = document.createElement('button');
  userBtn.className = 'user-profile-toggle';
  userBtn.innerHTML = '👤';

  const popper = document.createElement('div');
  popper.className = 'user-popper hidden';
  popper.innerHTML = `
    <div class="user-popper-content">
      <button class="logout-btn">Cerrar sesión</button>
    </div>
  `;

  userBtn.addEventListener('click', () => {
    popper.classList.toggle('hidden');
  });

  popper.querySelector('.logout-btn').addEventListener('click', () => {
    // Simula la lógica de logout (puedes conectarlo a tu store)
    alert('Sesión cerrada');
  });

  container.appendChild(userBtn);
  container.appendChild(popper);
}

// **Navbar renderizado según estado de autenticación**

export function renderNavbarContainer(routes) {
  const { header, nav } = createAppBar(); // Crear la estructura de la appBar

  // Contenedor principal del Navbar
  const container = nav;

  // Sección izquierda: Logo + Menú
  const left = document.createElement('div');
  left.className = 'navbar-left';

  // Logo siempre visible
  left.appendChild(createLogo());

  // Si está autenticado o es móvil, mostramos el icono de menú
  if (isAuthenticated || (!isAuthenticated && isMobile())) {
    left.appendChild(createMenuToggleBtn());
  }

  container.appendChild(left);

  // Menú de rutas (solo se muestra si no está autenticado o en móvil)
  if (isAuthenticated) {
    renderAuthNavItems(container, routes); // Si está autenticado, mostramos los elementos del menú autenticado
  } else {
    renderPublicNavItems(container); // Si no está autenticado, mostramos el menú público
  }

  // Popper de usuario (solo si está autenticado)
  if (isAuthenticated) {
    const userContainer = document.createElement('div');
    userContainer.className = 'user-container';
    renderUserPopper(userContainer); // Llamamos a la función para renderizar el popper de usuario
    container.appendChild(userContainer);
  }

  // Insertamos el header (navbar) en el contenedor específico
  const navbarContainer = document.getElementById('navbar-container');
  navbarContainer.appendChild(header); // Aquí insertamos el header dentro del contenedor en el HTML
}

// **Menú de rutas públicos**
function renderPublicNavItems(container) {
  const publicNav = document.createElement('div');
  publicNav.className = 'public-nav';
  publicNav.innerHTML = '<span>Menú público - Iniciar sesión para más opciones</span>';
  container.appendChild(publicNav);
}

// **Menú de rutas autenticadas**
function renderAuthNavItems(container, routes) {
  const authNav = document.createElement('div');
  authNav.className = 'auth-nav';
  routes.forEach(route => {
    const routeItem = document.createElement('div');
    routeItem.className = 'route-item';
    routeItem.innerHTML = `<a href="${route.path}">${route.title}</a>`;
    authNav.appendChild(routeItem);
  });
  container.appendChild(authNav);
}

// **Ejemplo de Rutas para la navegación**




// **CSS Básico para Estilizar**
const style = document.createElement('style');
style.innerHTML = `
  .app-bar {
    width: 100%;
    display: flex;
    position:fixed;
    z-index:2500;
    justify-content: space-between;
    padding: 10px;
    background-color:rgb(0, 116, 232);
  }
  .navbar-container {
    display: flex;
    align-items: center;
  }
  .navbar-left {
    display: flex;
    align-items: center;
  }
  .navbar-logo {
    font-size: 20px;
    margin-right: 10px;
  }
  .menu-toggle {
    font-size: 24px;
    cursor: pointer;
  }
  .user-popper {
    position: absolute;
    right: 20px;
    top: 50px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .user-popper.hidden {
    display: none;
  }
  .public-nav {
    background-color: #ddd;
    padding: 10px;
    border-radius: 4px;
  }
  .auth-nav {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 4px;
  }
  .route-item {
    margin-bottom: 8px;
  }
`;
document.head.appendChild(style);
