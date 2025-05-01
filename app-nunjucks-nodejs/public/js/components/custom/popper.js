export function createPopper(referenceElement, popperElement, options = []) {
  function updatePosition() {
    const refRect = referenceElement.getBoundingClientRect();
    const popRect = popperElement.getBoundingClientRect();

    let top = refRect.bottom + window.scrollY + 8; // Posición por defecto (abajo)
    let left = refRect.left + window.scrollX;

    // Evitar que se salga de la pantalla (ajuste horizontal)
    if (left + popRect.width > window.innerWidth) {
      left = window.innerWidth - popRect.width - 10;
    }

    // Evitar que se salga por abajo
    if (top + popRect.height > window.innerHeight) {
      top = refRect.top + window.scrollY - popRect.height - 8; // Posicionar arriba si no hay espacio
    }

    popperElement.style.top = `${top}px`;
    popperElement.style.left = `${left}px`;
  }

  // Aplicar estilos iniciales al popper
  Object.assign(popperElement.style, {
    position: 'absolute',
    zIndex: '1000',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '8px', // Bordes redondeados
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Sombra más suave
    display: 'none', // Inicialmente no visible
    maxWidth: '250px', // Ancho máximo
    transition: 'opacity 0.3s ease, transform 0.3s ease', // Transiciones suaves
    fontFamily: 'Arial, sans-serif', // Fuente más neutral
    opacity: '0',
  });

  // Crear un triángulo en la parte superior
  const arrow = document.createElement('div');
  arrow.style.position = 'absolute';
  arrow.style.top = '-8px'; // Ajuste la distancia entre el triángulo y el popper
  arrow.style.left = '50%';
  arrow.style.transform = 'translateX(-50%)';
  arrow.style.width = '0';
  arrow.style.height = '0';
  arrow.style.borderLeft = '8px solid transparent';
  arrow.style.borderRight = '8px solid transparent';
  arrow.style.borderBottom = '8px solid white'; // El color del triángulo, debe coincidir con el fondo del popper
  popperElement.appendChild(arrow);

  // Crear el contenido del menú de opciones
  const menuList = document.createElement('ul');
  menuList.style.listStyle = 'none';
  menuList.style.padding = '0';
  menuList.style.margin = '0';

  options.forEach((option) => {
    const listItem = document.createElement('li');
    listItem.textContent = option;
    listItem.style.padding = '12px 16px'; // Padding más espacioso
    listItem.style.cursor = 'pointer';
    listItem.style.borderRadius = '6px'; // Redondear los bordes de los ítems
    listItem.style.transition = 'background-color 0.2s, color 0.2s'; // Transiciones de hover

    // Estilo de hover similar al de Facebook
    listItem.addEventListener('mouseenter', () => {
      listItem.style.backgroundColor = '#f2f2f2'; // Color de fondo al pasar el mouse
      listItem.style.color = '#0078d4'; // Cambiar color del texto
    });

    listItem.addEventListener('mouseleave', () => {
      listItem.style.backgroundColor = 'transparent'; // Volver a fondo transparente
      listItem.style.color = 'black'; // Vuelve al color negro
    });

    // Acción al hacer clic en una opción
    listItem.addEventListener('click', () => {
      alert(`Opción seleccionada: ${option}`);
      popperElement.style.display = 'none'; // Cerrar el menú al hacer clic
    });

    menuList.appendChild(listItem);
  });

  popperElement.appendChild(menuList);

  // Posicionar el popper al principio
  updatePosition();

  // Posicionar al cambiar tamaño/scroll
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition);

  return {
    show() {
      popperElement.style.display = 'block'; // Mostrar el popper
      popperElement.style.opacity = '1';
      popperElement.style.transform = 'scale(1)';
      updatePosition();
    },
    hide() {
      popperElement.style.display = 'none'; // Ocultar el popper
      popperElement.style.opacity = '0';
      popperElement.style.transform = 'scale(0.95)';
    },
    destroy() {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    },
  };
}
