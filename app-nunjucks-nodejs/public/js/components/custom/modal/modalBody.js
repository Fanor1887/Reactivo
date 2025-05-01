// modalBody.js
export function createModalBody(content) {
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  // Asegurarse de que el contenido no sea una cadena, sino un nodo HTML
  if (content instanceof HTMLElement) {
    modalBody.appendChild(content);
  } else {
    const contentText = document.createElement('p');
    contentText.textContent = content;
    modalBody.appendChild(contentText);
  }

  // Estilos del cuerpo del modal
  Object.assign(modalBody.style, {
    padding: '20px',
    backgroundColor: '#130242',
  });

  return modalBody;
}
