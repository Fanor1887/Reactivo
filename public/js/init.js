document.addEventListener('DOMContentLoaded', () => {
  init(); // Llama a la función principal
});

// Función principal de inicialización
async function init() {
  const navbar = document.getElementById('navbar');
  const contentContainer = document.getElementById('content');

  if (!navbar || !contentContainer) {
    console.error('❌ No se encontró navbar o content en el DOM');
    return;
  }

  try {
    const routes = await loadRoutes(); // Obtiene las rutas desde el servidor

    if (routes.length === 0) {
      console.error('❌ No hay rutas disponibles');
      return;
    }

    if (navbar.children.length === 0) {
      populateNavbar(routes, navbar); // Poblar el navbar con las rutas
    }

    // Cargar el contenido de la primera ruta si no se ha cargado aún
    if (routes.length > 0 && !contentContainer.innerHTML) {
      await loadContent(routes[0]); // Cargar contenido de la primera ruta
    }
  } catch (err) {
    console.error('Error al cargar las rutas:', err);
  }
}

// Función para cargar las rutas desde la API
async function loadRoutes() {
  const response = await fetch('/api/routes');
  const data = await response.json();
  return data.routes || [];
}

// Función para poblar el navbar con las rutas
function populateNavbar(routes, navbar) {
  routes.forEach((route) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = route.path;
    link.textContent = route.title;
    link.onclick = (e) => {
      e.preventDefault();
      loadContent(route); // Llama a loadContent cuando se hace clic
    };
    li.appendChild(link);
    navbar.appendChild(li);
  });
}

// Función para cargar el contenido de la ruta seleccionada
async function loadContent(route) {
  const contentContainer = document.getElementById('content');
  try {
    const html = await fetchHtml(route.path);
    contentContainer.innerHTML = html;

    // Ejecutar los scripts contenidos en la nueva sección
    executeScripts(contentContainer);
  } catch (error) {
    contentContainer.innerHTML = `<p>Error al cargar el contenido de ${route.title}</p>`;
    console.error('Error al cargar contenido:', error);
  }
}

// Función para hacer fetch de HTML
async function fetchHtml(path) {
  const response = await fetch(path);
  return response.text();
}

// Función para ejecutar los scripts dentro del contenido cargado
function executeScripts(contentContainer) {
  const scripts = contentContainer.querySelectorAll('script');
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.replaceWith(newScript);
  });
}
