// sidebar.js

import { loadContent } from '../../contentLoader.js';

document.addEventListener('DOMContentLoaded', () => {
  loadSidebar(); // Llama a la función que carga el sidebar
});

// Función para cargar el contenido del sidebar
async function loadSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) {
    console.error('❌ No se encontró el sidebar en el DOM');
    return;
  }

  try {
    const routes = await loadRoutes(); // Cargar las rutas desde la API

    if (routes.length === 0) {
      console.error('❌ No hay rutas disponibles para el sidebar');
      return;
    }

    // Poblar el sidebar con las rutas obtenidas
    populateSidebar(routes, sidebar);
  } catch (err) {
    console.error('Error al cargar el sidebar:', err);
  }
}

// Función para cargar las rutas desde la API
async function loadRoutes() {
  const response = await fetch('/api/routes');
  const data = await response.json();
  return data.routes || [];
}

// Función para poblar el sidebar con las rutas
function populateSidebar(routes, sidebar) {
  routes.forEach((route) => {
    const div = document.createElement('div');
    div.className = 'sidebar-item';

    const link = document.createElement('a');
    link.href = route.path;
    link.textContent = route.title;
    link.onclick = (e) => {
      e.preventDefault();
      loadContent(route); // Cargar el contenido de la ruta al hacer clic en el link
    };

    div.appendChild(link);
    sidebar.appendChild(div);
  });
}
