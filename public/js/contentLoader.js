// /public/js/contentLoader.js

// Función para cargar las rutas desde la API
export async function loadRoutes() {
  const response = await fetch('/api/routes');
  const data = await response.json();
  return data.routes || [];
}

// Función para hacer fetch de HTML
export async function fetchHtml(path) {
  const response = await fetch(path);
  return response.text();
}

// Función para ejecutar los scripts dentro del contenido cargado
export function executeScripts(contentContainer) {
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

// Función para cargar el contenido de la ruta seleccionada
export async function loadContent(route) {
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
