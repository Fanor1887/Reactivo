/**
 * Crea un AppBar altamente configurable con posicionamiento flexible
 * @param {Object} options - Opciones de configuración
 * @param {string} [options.bgColor='#ffffff'] - Color de fondo
 * @param {string} [options.shadow='0 2px 4px rgba(0,0,0,0.1)'] - Sombra
 * @param {string} [options.height='64px'] - Altura
 * @param {string} [options.title] - Título (opcional)
 * @param {string} [options.textColor] - Color del texto
 * @param {string} [options.position='fixed'] - Posición
 * @param {string} [options.padding='0 16px'] - Padding interno
 * @param {HTMLElement[]} [options.leftElements=[]] - Elementos izquierda
 * @param {HTMLElement[]} [options.centerElements=[]] - Elementos centro
 * @param {HTMLElement[]} [options.rightElements=[]] - Elementos derecha
 * @param {string} [options.className=''] - Clase CSS adicional
 * @param {Object} [options.customStyles={}] - Estilos personalizados
 * @param {string} [options.layout='auto'] - 'auto'|'space-between'|'flex-start'|'flex-end'
 * @returns {HTMLElement} Elemento del AppBar
 */
export function customAppBar(options = {}) {
  const {
    bgColor = '#ffffff',
    shadow = '0 2px 4px rgba(0,0,0,0.1)',
    height = '64px',
    title,
    textColor,
    position = 'fixed',
    padding = '0 16px',
    leftElements = [],
    centerElements = [],
    rightElements = [],
    className = '',
    customStyles = {},
    layout = 'auto' // 'auto' determina automáticamente el layout
  } = options;
  
  const header = document.createElement('header');
  header.className = `app-bar ${className}`.trim();
  
  // Calcular color de texto automático
  const autoTextColor = bgColor === '#ffffff' ? '#333' : '#fff';
  
  // Estilos base
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    padding: padding,
    backgroundColor: bgColor,
    boxShadow: shadow,
    height: height,
    color: textColor || autoTextColor,
    width: '100%',
    boxSizing: 'border-box',
    position: position,
    top: '0',
    left: '0',
    zIndex: '1000'
  }, customStyles);

  // Determinar el layout automáticamente si no se especifica
  const actualLayout = layout === 'auto' 
    ? determineLayout(leftElements, centerElements, rightElements)
    : layout;
  
  header.style.justifyContent = actualLayout;

  // Crear contenedores
  const leftContainer = createElementsContainer('left', leftElements);
  const centerContainer = createElementsContainer('center', centerElements);
  const rightContainer = createElementsContainer('right', rightElements);

  // Añadir título si existe y no hay centerElements
  if (title && centerElements.length === 0) {
    const titleElement = createTitleElement(title);
    centerContainer.appendChild(titleElement);
  }

  // Añadir contenedores al header según el layout
  if (actualLayout === 'space-between') {
    if (leftElements.length > 0) header.appendChild(leftContainer);
    if (centerElements.length > 0 || title) header.appendChild(centerContainer);
    if (rightElements.length > 0) header.appendChild(rightContainer);
  } else {
    // Para otros layouts, añadir en orden pero con flexibilidad
    [leftContainer, centerContainer, rightContainer].forEach(container => {
      if (container.childNodes.length > 0) {
        header.appendChild(container);
      }
    });
  }
  
  return header;
}

// Helper para determinar el layout automáticamente
function determineLayout(left, center, right) {
  const hasLeft = left.length > 0;
  const hasCenter = center.length > 0;
  const hasRight = right.length > 0;

  if ((hasLeft && hasRight) || (hasLeft && hasCenter) || (hasCenter && hasRight)) {
    return 'space-between';
  }
  if (hasRight) return 'flex-end';
  return 'flex-start'; // default o solo left
}

// Helper para crear contenedores de elementos
function createElementsContainer(position, elements) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.gap = '16px';
  
  // Estilos específicos por posición
  if (position === 'center') {
    container.style.justifyContent = 'center';
    container.style.flexGrow = '1';
  } else if (position === 'right') {
    container.style.marginLeft = 'auto';
  }
  
  // Añadir elementos al contenedor
  elements.forEach(el => container.appendChild(el));
  
  return container;
}

// Helper para crear el elemento título
function createTitleElement(title) {
  const titleElement = document.createElement('h1');
  titleElement.textContent = title;
  Object.assign(titleElement.style, {
    margin: '0',
    fontSize: '1.25rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  });
  return titleElement;
}