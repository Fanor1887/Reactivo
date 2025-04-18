// utils/textUtils.js

/**
 * Crea un componente de texto con propiedades personalizables.
 * @param {string} variant - Tipo de elemento de texto (ej: 'h1', 'h2', 'p', 'span').
 * @param {string} text - Contenido de texto.
 * @param {Object} styles - Estilos CSS para el texto (opcional).
 * @param {string} className - Clase CSS adicional (opcional).
 * @returns {HTMLElement} - El elemento de texto creado.
 */
export function CreateText(variant = 'p', text, styles = {}, className = '') {
  // Crear el elemento de texto
  const textElement = document.createElement(variant);

  // Asignar el contenido de texto
  textElement.textContent = text;

  // Estilos predeterminados
  const defaultStyles = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    color: '#333',
    margin: '0',
    padding: '0',
    lineHeight: '1.5',
  };

  // Combinar estilos predeterminados con los estilos personalizados
  const finalStyles = { ...defaultStyles, ...styles };

  // Aplicar estilos al elemento de texto
  Object.assign(textElement.style, finalStyles);

  // Agregar clase CSS si se proporciona
  if (className) {
    textElement.classList.add(className);
  }

  return textElement;
}
