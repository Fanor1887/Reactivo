/**
 * Crea un AppBar con posicionamiento flexible de elementos
 * @param {Object} config - Configuración del AppBar
 * @param {Array} config.elements - Elementos a renderizar
 * @param {number} [config.columns=3] - Número de columnas
 * @param {Object} [config.styles] - Estilos CSS para el AppBar
 * @returns {HTMLElement} El elemento AppBar creado
 */
export function dynamicAppBar(config = {}) {
  const {
    elements = [],
    columns = 3,
    styles = {},
    ...otherProps
  } = config;

  // Validar columnas
  const validColumns = Math.max(1, Math.min(columns, 6));

  // Crear contenedor principal
  const appBar = document.createElement('header');
  appBar.className = 'dynamic-app-bar';
  
  // Estilos base
  Object.assign(appBar.style, {
    top:0,
    display: 'grid',
    gridTemplateColumns: `repeat(${validColumns}, 1fr)`,
    alignItems: 'stretch', // Cambiado para mejor soporte de posicionamiento
    backgroundColor: '#ffffff',
  zIndex:999,
  
    width: '100%',
    padding: '0 16px',
    boxSizing: 'border-box',
    position: 'sticky',
    gap: '16px',
    ...styles
  });

  // Crear contenedores padres
  const containers = Array(validColumns).fill().map((_, i) => {
    const container = createContainerElement(i);
    appBar.appendChild(container);
    return container;
  });

  // Distribuir elementos
  elements.forEach((elementConfig, i) => {
    const element = createDraggableElement(elementConfig, i);
    const targetIndex = Math.min(elementConfig.initialPosition ?? 0, containers.length - 1);
    const container = containers[targetIndex];
    
    container.appendChild(element);
    setupElementPosition(element, elementConfig.position);
  });

  return appBar;
}

// Helpers actualizados
function createContainerElement(index) {
  const container = document.createElement('div');
  container.className = 'app-bar-container';
  container.dataset.index = index;
  
  Object.assign(container.style, {
    position: 'relative', // Importante para posicionamiento absoluto de hijos
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '100%',
    padding: '8px',
    border: '2px dashed rgba(0,0,0,0.1)',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    overflow: 'visible'
  });

  setupDropZone(container);
  return container;
}

function createDraggableElement(config, id) {
  const element = document.createElement('div');
  element.id = `appbar-element-${id}`;
  element.className = 'app-bar-element';
  
  // Configurar contenido según tipo
  switch(config.type) {
    case 'text':
      element.textContent = config.content;
      break;
    case 'button':
      const button = document.createElement('button');
      button.textContent = config.content;
      if (config.action) button.addEventListener('click', config.action);
      element.appendChild(button);
      break;
    case 'icon':
      const icon = document.createElement('i');
      icon.className = config.className || '';
      icon.textContent = config.content || '';
      if (config.action) icon.addEventListener('click', config.action);
      element.appendChild(icon);
      break;
    case 'custom':
      if (config.render) element.appendChild(config.render());
      break;
  }

  // Estilos base del elemento
  Object.assign(element.style, {
    cursor: 'grab',
    userSelect: 'none',
    transition: 'all 0.2s ease',
    position: 'absolute', // Posicionamiento absoluto por defecto
    zIndex: '10',
    ...config.styles
  });

  // Configurar arrastre libre
  setupFreeDrag(element);
  
  return element;
}

function setupElementPosition(element, position = 'center') {
  // Resetear estilos primero
  element.style.left = '';
  element.style.right = '';
  element.style.top = '';
  element.style.bottom = '';
  element.style.transform = '';
  element.style.margin = '';

  // Si es string (posición predefinida)
  if (typeof position === 'string') {
    const positions = position.split(' '); // Soporta combinaciones como "left top"
    
    positions.forEach(pos => {
      switch(pos) {
        case 'left':
          element.style.left = '8px';
          element.style.right = 'auto';
          break;
        case 'right':
          element.style.right = '8px';
          element.style.left = 'auto';
          break;
        case 'center':
          element.style.left = '50%';
          element.style.right = 'auto';
          element.style.transform = 'translateX(-50%)';
          break;
        case 'top':
          element.style.top = '8px';
          element.style.bottom = 'auto';
          break;
        case 'bottom':
          element.style.bottom = '8px';
          element.style.top = 'auto';
          break;
        case 'middle':
          element.style.top = '50%';
          element.style.bottom = 'auto';
          element.style.transform = (element.style.transform || '') + ' translateY(-50%)';
          break;
      }
    });
  } 
  // Si es objeto (coordenadas exactas)
  else if (typeof position === 'object') {
    if (position.x !== undefined) {
      element.style.left = `${position.x}px`;
      element.style.right = 'auto';
    }
    if (position.y !== undefined) {
      element.style.top = `${position.y}px`;
      element.style.bottom = 'auto';
    }
  }
}

function setupFreeDrag(element) {
  let offsetX, offsetY;
  let isDragging = false;

  element.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Solo botón izquierdo
    
    isDragging = true;
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    element.style.cursor = 'grabbing';
    element.style.zIndex = '100';
    element.style.transition = 'none';
    element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    
    document.addEventListener('mousemove', moveElement);
    document.addEventListener('mouseup', stopDrag);
  });

  function moveElement(e) {
    if (!isDragging) return;
    
    const container = element.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    // Calcular nueva posición
    let left = e.clientX - containerRect.left - offsetX;
    let top = e.clientY - containerRect.top - offsetY;
    
    // Limitar al área del contenedor
    left = Math.max(0, Math.min(left, containerRect.width - element.offsetWidth));
    top = Math.max(0, Math.min(top, containerRect.height - element.offsetHeight));
    
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    element.style.transform = 'none';
  }

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    
    element.style.cursor = 'grab';
    element.style.zIndex = '10';
    element.style.transition = 'all 0.2s ease';
    element.style.boxShadow = '';
    
    document.removeEventListener('mousemove', moveElement);
    document.removeEventListener('mouseup', stopDrag);
  }
}

function setupDropZone(container) {
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    container.style.borderColor = '#6200ea';
    container.style.backgroundColor = 'rgba(98,0,234,0.05)';
  });

  container.addEventListener('dragleave', () => {
    container.style.borderColor = 'rgba(0,0,0,0.1)';
    container.style.backgroundColor = 'transparent';
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    container.style.borderColor = 'rgba(0,0,0,0.1)';
    container.style.backgroundColor = 'transparent';
    
    const elementId = e.dataTransfer.getData('text/plain');
    const element = document.getElementById(elementId);
    
    if (element) {
      container.appendChild(element);
      // Centrar el elemento al soltarlo
      setupElementPosition(element, 'center');
    }
  });
}