import { hideSpinner, showSpinner } from '../components/common/spinner.js';
import { store } from '../store/index.js';

// Función para desplazar la vista a un elemento con un hash
export const scrollToHash = (hash) => {
  const offset = 70; // Ajusta el offset según el header
  const targetElement = document.querySelector(hash);

  if (targetElement) {
    const elementPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    console.log(`Scrolling to target element: ${hash}`);
  } else {
    console.warn('Elemento de destino no encontrado:', hash);
  }
};

export const executeScripts = (container) => {
  const scripts = container.querySelectorAll('script');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    newScript.type = script.type || 'text/javascript';
    if (script.src) {
      newScript.src = script.src;
      newScript.onload = () => console.log(`${script.src} loaded.`);
    } else {
      newScript.text = script.textContent || script.innerHTML;
    }
    document.body.appendChild(newScript);
  });
};

export async function loadRoutes() {
  const response = await fetch('/api/routes');
  const data = await response.json();
  return data.routes || [];
}
// Función para cargar contenido con spinner
export async function loadContent(route) {
  const contentContainer = document.getElementById('content');

  // Ocultar el contenido y deshabilitar interacciones
  contentContainer.style.opacity = '0';

  contentContainer.style.pointerEvents = 'none';

  // Cambiar el fondo del contenedor mientras carga

  // Mostrar el spinner
  store.dispatch({ type: 'SHOW_SPINNER' });

  // Establecer la nueva ruta
  store.dispatch({
    type: 'SET_ROUTE',
    payload: route.path,
  });

  try {
    // Obtener el HTML como texto
    const html = await fetchHtml(route.path);

    // Convertir el texto HTML a un documento DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Buscar el div con id "content" en la respuesta
    const content = doc.querySelector('#content');
    if (content) {
      // Reemplazar el contenido actual por el nuevo
      contentContainer.innerHTML = content.innerHTML;
    } else {
      throw new Error(
        '❌ No se encontró el elemento #content en la respuesta.'
      );
    }

    // Ejecutar scripts del nuevo contenido
    executeScripts(contentContainer);
  } catch (error) {
    // Mostrar mensaje de error
    contentContainer.innerHTML = `<p>Error al cargar el contenido de <strong>${route.title}</strong>.</p>`;
    console.error('Error al cargar contenido:', error);
  } finally {
    // Ocultar el spinner después de un segundo
    setTimeout(() => {
      contentContainer.style.transition = 'opacity 0.5s ease';

      store.dispatch({ type: 'HIDE_SPINNER' });
    }, 1000);

    // Mostrar el contenido después de 1.5 segundos
    setTimeout(() => {
      contentContainer.style.opacity = '1';
      contentContainer.style.pointerEvents = 'auto';
    }, 1500);
  }
}

async function fetchHtml(path) {
  const response = await fetch(path);
  return response.text();
}
