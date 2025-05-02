import { customAppBar } from "../components/custom/customAppBar.js";

/**
 * Renderiza el AppBar en el contenedor especificado
 * @param {HTMLElement|string} container - Contenedor o su ID
 * @param {Object} options - Opciones para createAppBar
 * @param {boolean} [options.clearContainer=true] - Limpiar contenedor antes de renderizar
 * @param {Object} [options.containerStyles] - Estilos para el contenedor
 * @returns {HTMLElement|null} El AppBar renderizado o null si falla
 */
export function renderAppBar(container, options = {}) {
    const { clearContainer = true, containerStyles = {}, ...appBarOptions } = options;
    
    // Crear el AppBar
    const appBar = customAppBar(appBarOptions);
    
    // Obtener contenedor (puede ser elemento o ID)
    let containerElement = typeof container === 'string' 
      ? document.getElementById(container) 
      : container;
    
    if (!containerElement) {
      console.error('Contenedor no encontrado');
      return null;
    }
    
    // Limpiar contenedor si se especifica
    if (clearContainer) {
      containerElement.innerHTML = '';
    }
    
    // Aplicar estilos al contenedor
    if (Object.keys(containerStyles).length > 0) {
      Object.assign(containerElement.style, containerStyles);
    }
    
    // Añadir AppBar al contenedor
    containerElement.appendChild(appBar);
    
    return appBar;
  }