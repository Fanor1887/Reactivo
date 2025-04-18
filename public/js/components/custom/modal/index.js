import { createModalHeader } from './modalHeader.js';
import { createModalBody } from './modalBody.js';
import { createModalFooter } from './modalFooter.js';
import { createOverlay } from './modalOverlay.js';
import { applyModalStyles } from '../../../styles/components/custom/modalStyles.js';

// Función para generar un ID único para el modal
function generateModalId() {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 7);
  const modalId = `MODAL-${timestamp}-${randomId}`;

  // Guardar el ID del modal en localStorage
  const modalsInStorage = JSON.parse(localStorage.getItem('modals')) || [];
  modalsInStorage.push(modalId);
  localStorage.setItem('modals', JSON.stringify(modalsInStorage));

  return modalId;
}

// Crear el modal y asociar el contenido, título, acciones, y tamaño
export function createModal(title, content, actions, sizeModal) {
  const modalId = generateModalId();

  // Agregar el console.log para ver el ID generado
  console.log('Modal ID generado:', modalId);

  toggleModal(true, content, title, sizeModal, actions, modalId);

  // Actualizar el título del modal
  const modalTitle = document.querySelector(`#${modalId} .modal-title`);
  if (modalTitle) {
    modalTitle.textContent = title;
  }

  // Crear el pie del modal
  const modalFooter = createModalFooter(actions, modalId); // Ahora pasamos el modalId para que se pueda cerrar
  const modalBody = document.querySelector(`#${modalId} .modal-body`);

  // Limpiar el footer antes de agregar uno nuevo
  const existingFooter = document.querySelector(`#${modalId} .modal-footer`);
  if (existingFooter) {
    existingFooter.innerHTML = ''; // Limpiar el contenido anterior
    existingFooter.appendChild(modalFooter); // Agregar los botones nuevos
  } else {
    modalBody.appendChild(modalFooter); // Si no existe un footer, agregamos el nuevo
  }
}

// Modificación en el archivo que gestiona los modales (index.js)
let modalsStack = []; // Usamos una pila para almacenar los modales abiertos

export function toggleModal(
  isOpen,
  content = '',
  title = '',
  sizeModal,
  actions,
  modalId
) {
  let modal = document.getElementById(modalId);

  // Si el modal no existe, crearlo
  if (!modal) {
    modal = document.createElement('div');
    modal.id = modalId;

    const overlay = createOverlay(); // Crear la superposición
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Crear el encabezado
    const modalHeader = createModalHeader(modalId, title);
    modalContent.appendChild(modalHeader);

    // Crear el cuerpo del modal
    const modalBody = createModalBody(content);
    modalContent.appendChild(modalBody);

    // Crear el pie del modal
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    modalContent.appendChild(modalFooter);

    modal.appendChild(overlay);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Aplicar los estilos con el tamaño dinámico
    applyModalStyles(modal, modalContent, overlay, sizeModal);

    // Añadir event listener para cerrar cuando se hace clic fuera del modal
    overlay.addEventListener('click', () =>
      toggleModal(false, '', '', sizeModal, actions, modalId)
    );
  }

  // Si el modal se está abriendo, agregarlo a la pila
  if (isOpen) {
    modalsStack.push(modalId);
  } else {
    // Si el modal se está cerrando, eliminarlo de la pila
    modalsStack = modalsStack.filter((id) => id !== modalId);

    // Eliminar todos los modales de localStorage cuando se cierra cualquier modal
    localStorage.removeItem('modals');
  }

  // Mostrar/Ocultar el modal
  modal.style.display = isOpen ? 'flex' : 'none';
  const overlay = modal.querySelector('.modal-overlay');
  const modalContent = modal.querySelector('.modal-content');

  if (isOpen) {
    setTimeout(() => {
      overlay.style.opacity = '1'; // El overlay aparece suavemente
    }, 10);

    setTimeout(() => {
      modalContent.style.opacity = '1'; // El contenido aparece
      modalContent.style.transform = 'scale(1)'; // Se expande suavemente
    }, 10);
  } else {
    overlay.style.opacity = '0'; // El overlay desaparece
    modalContent.style.opacity = '0'; // El contenido desaparece
    modalContent.style.transform = 'scale(0)'; // Se contrae

    // Limpiar el modal completamente después de cerrarlo
    setTimeout(() => {
      modal.remove(); // Elimina el modal del DOM
    }, 500); // Esperar a que las animaciones terminen antes de eliminarlo
  }

  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = ''; // Limpiar contenido previo

  if (content instanceof HTMLElement) {
    modalBody.appendChild(content);
  } else {
    const contentText = document.createElement('p');
    contentText.textContent = content;
    modalBody.appendChild(contentText);
  }
}

// Modificación de closeModals para eliminar todos los modales de localStorage
export function closeModals() {
  // Cerrar los modales en el orden inverso (el último en abrirse será el primero en cerrarse)
  while (modalsStack.length > 0) {
    const modalId = modalsStack.pop(); // Obtener el último modal abierto
    toggleModal(false, '', '', '', [], modalId);
  }

  // Eliminar todos los modales de localStorage después de cerrar todos
  localStorage.removeItem('modals');
}
