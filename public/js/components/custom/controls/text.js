export function CreateText({
  variant = 'p', // Tipo de elemento (p, h1, h2, span, etc.)
  text, // El contenido de texto
  styles = {}, // Estilos personalizados para el texto
  className = '', // Clases adicionales para el elemento
  attributes = {}, // Atributos adicionales como id, data, etc.
}) {
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

  // Combinar los estilos predeterminados con los estilos personalizados
  const finalStyles = Object.assign({}, defaultStyles, styles);

  // Aplicar los estilos al elemento de texto
  Object.assign(textElement.style, finalStyles);

  // Agregar clases CSS si se proporcionan
  if (className) {
    textElement.classList.add(className);
  }

  // Asignar atributos adicionales (como id, data-id, etc.)
  Object.assign(textElement, attributes);

  return textElement;
}
