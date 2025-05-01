// utils/buttonUtils.js

/**
 * Crea un botón con propiedades personalizables.
 * @param {string} text - Texto del botón.
 * @param {Object} styles - Estilos CSS para el botón (opcional).
 * @param {Function} onClick - Función que se ejecutará al hacer clic en el botón (opcional).
 * @returns {HTMLButtonElement} - El botón creado.
 */
export function CreateButton(text, styles = {}, onClick = null) {
  // Crear el elemento botón
  const button = document.createElement('button');

  // Asignar el texto al botón
  button.textContent = text;

  // Estilos por defecto
  const defaultStyles = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  // Combinar estilos por defecto con los estilos personalizados
  const finalStyles = { ...defaultStyles, ...styles };

  // Aplicar estilos al botón
  Object.assign(button.style, finalStyles);

  // Asignar el evento onClick si se proporciona
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  // Efecto hover (opcional)
  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#0056b3'; // Cambiar color al pasar el mouse
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = finalStyles.backgroundColor; // Restaurar color al salir
  });

  return button;
}
