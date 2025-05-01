// Importamos los controladores desde el archivo index.js
import { controllers } from './controllers/index.js';

export function contentLoad(path) {
  const contentArea = document.getElementById('content-area');

  fetch(`/api/page?path=${path}`, {
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.json();
    })
    .then((data) => {
      const temp = document.createElement('div');
      temp.innerHTML = data.html;

      // Solo extrae lo que está dentro de #content-area del HTML recibido
      const newContent = temp.querySelector('#content-area');
      if (newContent) {
        contentArea.innerHTML = newContent.innerHTML;
      } else {
        console.warn('No se encontró #content-area en la respuesta');
        contentArea.innerHTML = data.html; // fallback
      }

      // Ejecutar controlador si existe
      if (controllers[path]) {
        controllers[path]();
      }
    })
    .catch((error) => {
      contentArea.innerHTML = `
        <h1>Error al cargar la página</h1>
        <pre>${error.message}</pre>
      `;
      console.error('Error al cargar contenido:', error);
    });
}
