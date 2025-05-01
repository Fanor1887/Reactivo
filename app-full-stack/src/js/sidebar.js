const routesConfig = {
  '/': '<h1>Inicio</h1>',
  '/about': '<h1>Acerca de</h1>',
  '/contact': '<h1>Contacto</h1>',
};

export async function setupSidebar() {
  try {
    // Simulamos llamada a API
    const routes = [
      { path: '/', name: 'Inicio', icon: '🏠' },
      { path: '/about', name: 'Acerca', icon: 'ℹ️' },
      { path: '/contact', name: 'Contacto', icon: '📞' },
    ];

    const sidebar = document.getElementById('sidebar-routes');
    sidebar.innerHTML = routes
      .map(
        (route) => `
      <li>
        <a href="${route.path}" class="nav-link">
          <span class="icon">${route.icon}</span>
          ${route.name}
        </a>
      </li>
    `
      )
      .join('');

    // Toggle
    document.getElementById('toggleSidebar').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    // Manejo SPA
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link');
      if (link) {
        e.preventDefault();
        const path = link.getAttribute('href');
        navigate(path);
      }
    });

    // Carga inicial y navegación con back/forward
    window.addEventListener('popstate', () => renderPage(location.pathname));
    renderPage(location.pathname);
  } catch (error) {
    console.error('Error cargando rutas:', error);
    document.getElementById(
      'sidebar-routes'
    ).innerHTML = `<li class="error">Error cargando el menú</li>`;
  }
}

function navigate(path) {
  history.pushState({}, '', path);
  renderPage(path);
}

function renderPage(path) {
  const app = document.getElementById('app');
  app.innerHTML = routesConfig[path] || '<h1>404 - Página no encontrada</h1>';
}
