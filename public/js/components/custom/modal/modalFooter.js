import { CreateButton } from '../../controls/button.js';
import { toggleModal, closeModals } from './index.js';

export function createModalFooter(actions = [], modalId) {
  const modalFooter = document.createElement('div');
  modalFooter.style.display = 'flex';
  modalFooter.style.justifyContent = 'flex-end';
  modalFooter.style.gap = '15px';
  modalFooter.style.padding = '15px 30px';
  modalFooter.style.borderTop = '1px solid #ddd';
  modalFooter.style.backgroundColor = '#f9f9f9';
  modalFooter.style.borderRadius = '0 0 12px 12px';
  modalFooter.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';

  if (!Array.isArray(actions) || actions.length === 0) {
    return modalFooter;
  }

  actions.forEach(
    ({ label, style = {}, onClick, closeOnClick = true, closeAll = false }) => {
      const button = CreateButton(label, style, (event) => {
        if (typeof onClick === 'function') {
          onClick(event);
        }

        if (closeOnClick) {
          if (closeAll) {
            closeModals(); // Cierra todos
          } else {
            toggleModal(false, '', '', '', [], modalId); // Cierra solo el actual
          }
        }
      });

      modalFooter.appendChild(button);
    }
  );

  return modalFooter;
}
