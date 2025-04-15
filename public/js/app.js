// public/js/main.js

// Importamos la función init desde el archivo init.js
import { init } from './init.js';

// Definimos la función que se ejecutará cuando el DOM esté completamente cargado
export function initializeElementsOnLoad() {
  // Esperamos a que el DOM esté completamente cargado

  init(); // Llamamos a la función init del archivo init.js
}

// Llamamos a la función de inicialización
document.addEventListener('DOMContentLoaded', initializeElementsOnLoad);
