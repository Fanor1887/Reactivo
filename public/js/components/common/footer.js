import { createModal } from '../custom/modal/index.js';

import { store } from '../../store/index.js';
import { createIcon } from './icon.js';
import { applyFooterStyles } from '../../styles/components/common/footerStyles.js';
import { logoutFromAPI } from '../../api/asyncAuth.js';

const isMobile = window.innerWidth <= 768;

function setIsSidebarOpen(status) {
  const sidebar = store.getState().sidebar;
  if (sidebar) sidebar.isSidebarOpen = status;
}

async function handleLogout(side, content) {
  logoutFromAPI();
}

export function setupFooter() {
  const footer = document.getElementById('footer');
  const footerContainer = applyFooterStyles(footer);
  const content = document.getElementById('content');
  const side = document.getElementById('side');

  // ✅ Obtener el estado global del usuario desde el store

  const user = store.getState().auth?.user;
  const roles =
    user?.roles || JSON.parse(localStorage.getItem('userRoles') || '[]');
  const footerTextArray = roles
    ? [
        {
          text: 'Descargar',
          icon: '⬇️',
          modalContent: 'Descarga nuestra app aquí.',
        },
        {
          text: 'Ver Estadísticas',
          icon: '📊',
          modalContent: 'Aquí puedes ver las estadísticas de tu cuenta.',
        },
        {
          text: 'Configuración de Privacidad',
          icon: '🔒',
          modalContent: 'Configura tu privacidad aquí.',
        },
        {
          text: 'Cerrar Sesión',
          icon: '🚪',
          modalContent: '¿Seguro que quieres cerrar sesión?',
          actions: [
            {
              label: 'Cerrar sesión',
              onClick: async () => {
                await handleLogout(side, content);
              },
            },
            { label: 'Cancelar' },
          ],
        },
      ]
    : [
        {
          text: 'Política de Privacidad',
          icon: '📄',
          modalContent: 'Aquí va la política de privacidad.',
        },
        {
          text: 'Términos del Servicio',
          icon: '📜',
          modalContent: 'Estos son los términos del servicio.',
        },
        {
          text: 'Contáctanos',
          icon: '✉️',
          modalContent: 'Puedes contactarnos en support@example.com',
        },
        {
          text: 'Sobre Nosotros',
          icon: '💡',
          modalContent: 'Somos una empresa innovadora en tecnología.',
        },
      ];

  footerTextArray.forEach(({ text, icon, modalContent, actions = null }) => {
    const column = document.createElement('div');
    column.style.padding = '10px';
    column.style.flex = '1 1 200px';
    column.style.display = 'flex';
    column.style.justifyContent = 'center';

    const link = document.createElement('a');
    link.href = '#';
    link.style.color = 'white';
    link.style.textDecoration = 'none';
    link.style.cursor = 'pointer';
    link.style.display = 'flex';
    link.style.flexDirection = 'row';
    link.style.alignItems = 'center';
    link.style.justifyContent = 'center';
    link.style.gap = '8px';
    link.title = text;

    const iconElement = createIcon(icon, 30, '#ffffff', 'circle');
    const label = document.createElement('span');
    label.textContent = text;
    label.className = 'footer-label';

    link.appendChild(iconElement);
    link.appendChild(label);

    link.addEventListener('click', (e) => {
      e.preventDefault();
      createModal(text, modalContent, actions, 'small');
    });

    column.appendChild(link);
    footerContainer.appendChild(column);
  });

  footer.appendChild(footerContainer);
  footer.style.position = 'relative';
  footer.style.width = '100%';
  footer.style.zIndex = '1000';

  // 🔁 Footer responsivo
  function applyResponsiveFooterLabels() {
    const labels = document.querySelectorAll('.footer-label');
    if (window.innerWidth <= 768) {
      labels.forEach((label) => (label.style.display = 'none'));
      footerContainer.style.flexWrap = 'nowrap';
    } else {
      labels.forEach((label) => (label.style.display = 'inline'));
      footerContainer.style.flexWrap = 'nowrap';
    }
  }

  window.addEventListener('resize', applyResponsiveFooterLabels);
  applyResponsiveFooterLabels();
}
