import { renderDynamicAppBar } from "../render/renderDynamicAppBar.js";


/**
 * Verifica el contenedor y renderiza el AppBar
 * @param {string|HTMLElement} container - Selector CSS o elemento DOM
 * @param {Object} config - Configuración del AppBar
 * @returns {HTMLElement|null} El AppBar creado o null si falla
 */
export function initAppBar(container, config = {}) {
  // Obtener el elemento contenedor
  let containerElement;
  
  if (typeof container === 'string') {
    // Buscar por ID primero
    containerElement = document.getElementById(container);
    
    // Si no se encuentra por ID, buscar por clase (primera coincidencia)
    if (!containerElement) {
      containerElement = document.querySelector(`.${container}`);
    }
  } else if (container instanceof HTMLElement) {
    containerElement = container;
  }

  // Verificar si se encontró el contenedor
  if (!containerElement) {
    console.error('No se encontró el contenedor:', container);
    return null;
  }

  // Renderizar el AppBar
  return renderDynamicAppBar(containerElement, config);
}