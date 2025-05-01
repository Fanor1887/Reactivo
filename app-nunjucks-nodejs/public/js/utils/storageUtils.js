import { hideSpinner, showSpinner } from '../components/common/spinner.js';
import { baseEndpoint } from '../config/apiEndpoint.js';
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
  console.log('routesApi', data);
  return data.routes || [];
}
export async function loadContent(route, addToHistory = true) {
  const contentContainer = document.getElementById('content');

  // Ocultar el contenido y deshabilitar interacciones
  contentContainer.style.opacity = '0';
  contentContainer.style.pointerEvents = 'none';

  // Mostrar el spinner
  store.dispatch({ type: 'SHOW_SPINNER' });

  // Establecer la nueva ruta
  store.dispatch({
    type: 'SET_ROUTE',
    payload: route.path,
  });
  localStorage.setItem('currentRoute', route.path);

  try {
    // Obtener el HTML como texto
    const response = await fetch(route.path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    // Crear un contenedor temporal para parsear el HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    // Reemplazar el contenido del contenedor con el nuevo contenido
    const newContent = tempDiv.querySelector('#content');
    if (newContent) {
      contentContainer.innerHTML = newContent.innerHTML;
    } else {
      throw new Error(
        '❌ No se encontró el elemento #content en la respuesta.'
      );
    }

    // Actualizar el título de la página
    document.title = tempDiv.querySelector('title')?.innerText || route.path;

    // Si `addToHistory` es verdadero, agregar la nueva ruta al historial
    if (addToHistory) {
      history.pushState({ url: route.path }, '', route.path);
    }

    // Comprobar si hay un hash en la URL y desplazarse hasta ese elemento
    const hashIndex = route.path.indexOf('#');
    if (hashIndex !== -1) {
      const hash = route.path.substring(hashIndex);
      scrollToHash(hash);
    }
  } catch (error) {
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
