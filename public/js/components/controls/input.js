// js/components/controls/input.js
export function CreateInput(
  name,
  type,
  placeholder, // Placeholder para la descripción del campo
  onChange,
  error = '',
  styles = {}
) {
  // Estilos por defecto
  const defaultStyles = {
    container: {
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    label: {
      position: 'absolute',
      top: '-10px', // Posición del label flotante
      left: '10px',
      backgroundColor: '#fff', // Fondo para que el label flotante se vea bien
      padding: '0 5px',
      fontSize: '12px',
      color: '#666',
      transition: 'all 0.3s ease', // Transición suave
    },
    error: {
      display: 'block',
      color: 'red',
      fontSize: '14px',
      marginTop: '5px',
    },
  };

  // Combinar estilos por defecto con estilos personalizados
  const combinedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    input: { ...defaultStyles.input, ...styles.input },
    label: { ...defaultStyles.label, ...styles.label },
    error: { ...defaultStyles.error, ...styles.error },
  };

  // Crear el contenedor del campo
  const container = document.createElement('div');
  Object.assign(container.style, combinedStyles.container);

  // Crear el campo de entrada
  const inputElement = document.createElement('input');
  inputElement.type = type;
  inputElement.id = name;
  inputElement.name = name;
  inputElement.placeholder = placeholder; // Usar el placeholder como descripción

  Object.assign(inputElement.style, combinedStyles.input);

  // Crear el label flotante
  const floatingLabel = document.createElement('label');
  floatingLabel.textContent = placeholder; // Usar el placeholder como texto del label
  Object.assign(floatingLabel.style, combinedStyles.label);

  // Mostrar u ocultar el label flotante según el foco y el contenido
  inputElement.addEventListener('focus', () => {
    floatingLabel.style.display = 'block';
  });

  inputElement.addEventListener('blur', () => {
    if (!inputElement.value) {
      floatingLabel.style.display = 'none';
    }
  });

  inputElement.addEventListener('input', (event) => {
    onChange(event.target.value); // Actualizar el valor en el estado
    if (event.target.value) {
      floatingLabel.style.display = 'block';
    } else {
      floatingLabel.style.display = 'none';
    }
  });

  // Crear el mensaje de error
  const errorElement = document.createElement('span');
  errorElement.id = `${name}-error`;
  errorElement.className = 'error-message';
  errorElement.textContent = error;
  Object.assign(errorElement.style, combinedStyles.error);

  // Función para actualizar el mensaje de error
  const updateError = (newError) => {
    if (newError) {
      inputElement.placeholder = newError; // Mostrar el error en el placeholder
      inputElement.style.borderColor = 'red'; // Cambiar el color del borde a rojo
    } else {
      inputElement.placeholder = placeholder; // Restaurar el placeholder original
      inputElement.style.borderColor = '#ccc'; // Restaurar el color del borde
    }
  };

  // Agregar elementos al contenedor
  container.appendChild(inputElement);
  container.appendChild(floatingLabel);
  container.appendChild(errorElement);

  // Inicializar el error si existe
  updateError(error);

  return {
    container,
    updateError, // Permitir actualizar el mensaje de error desde fuera
  };
}
