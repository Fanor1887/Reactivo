import { createIcon } from '../icon.js';
import { toggleModal } from './index.js';

export function createModalHeader(modalId, title) {
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  modalTitle.textContent = title;
  modalHeader.appendChild(modalTitle);

  // Crear el botón de cierre usando createIcon con parámetros personalizados
  const closeIcon = createIcon('&times;', 24, '#fff', {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#fff',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  });

  closeIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic se propague al overlay y cierre el modal.
    toggleModal(false, '', '', '', [], modalId); // Cerrar el modal usando el modalId
  });

  modalHeader.appendChild(closeIcon); // Añadir el ícono de cierre al encabezado

  // Estilos básicos para el modalHeader (puedes moverlo a CSS)
  Object.assign(modalHeader.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderBottom: '2px solid #0056b3',
  });

  // Estilos del título
  Object.assign(modalTitle.style, {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0',
  });

  return modalHeader;
}
