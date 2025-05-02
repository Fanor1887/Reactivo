import { dynamicAppBar } from "../components/dynamic/dynamicAppBar.js";


/**
 * Renderiza el AppBar dinámico en el contenedor especificado
 * @param {HTMLElement} container - Contenedor donde se insertará
 * @param {Object} config - Configuración del AppBar
 * @returns {HTMLElement|null} El AppBar creado o null si falla
 */
export function renderDynamicAppBar(container, config = {}) {
  if (!container) {
    console.error('Contenedor no proporcionado');
    return null;
  }

  // Crear el AppBar
  const appBar = dynamicAppBar(config);

  // Limpiar y añadir al contenedor
  container.innerHTML = '';
  container.appendChild(appBar);

  return appBar;
}