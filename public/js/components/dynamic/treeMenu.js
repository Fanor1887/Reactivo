/**
 * Renderiza un árbol de menú dinámico basado en items genéricos.
 * @param {Array} items - Arreglo de objetos (menú, rutas, categorías, etc.)
 * @param {Object} config - Configuración para estructurar el menú
 *    {
 *      keyField: nombre del campo que actúa como ID (default: 'path'),
 *      labelField: campo que se muestra como texto (default: 'title'),
 *      childrenField: campo que contiene subniveles (default: 'subroutes'),
 *      currentValue: valor actual activo para resaltar,
 *      onItemAction: función a ejecutar al clickear (item) => {},
 *      getHref: función opcional para generar el href de un item,
 *      baseClass: clase base (navbar, sidebar, etc.),
 *      showArrows: booleano para mostrar flechas (default: true),
 *      level: nivel interno (no enviar manualmente)
 *    }
 */
export function createDynamicTreeMenu(items, config = {}) {
    const {
      keyField = 'path',
      labelField = 'title',
      childrenField = 'subroutes',
      currentValue = '',
      onItemAction = () => {},
      getHref = (item) => item[keyField],
      baseClass = 'menu',
      showArrows = true,
      level = 0
    } = config;
  
    const ul = document.createElement('ul');
    ul.className = level === 0 ? `${baseClass}-list` : `${baseClass}-sublist`;
  
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = `${baseClass}-item`;
  
      const wrapper = document.createElement('div');
      wrapper.className = `${baseClass}-link-wrapper`;
  
      const a = document.createElement('a');
      a.href = getHref(item);
      a.textContent = item[labelField] || item[keyField];
      a.className = `${baseClass}-link`;
  
      if (item[keyField] === currentValue) {
        a.classList.add('active');
      }
  
      a.addEventListener('click', (e) => {
        e.preventDefault();
        onItemAction(item);
      });
  
      wrapper.appendChild(a);
  
      const children = item[childrenField];
      if (showArrows && Array.isArray(children) && children.length > 0) {
        const toggleBtn = document.createElement('span');
        toggleBtn.className = 'arrow-toggle';
        toggleBtn.innerHTML = '▶';
  
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const subUl = li.querySelector('ul');
          const isOpen = subUl.classList.toggle('open');
          toggleBtn.innerHTML = isOpen ? '▼' : '▶';
        });
  
        wrapper.appendChild(toggleBtn);
      }
  
      li.appendChild(wrapper);
  
      if (Array.isArray(children) && children.length > 0) {
        const childMenu = createDynamicTreeMenu(children, {
          ...config,
          level: level + 1
        });
        li.appendChild(childMenu);
      }
  
      ul.appendChild(li);
    });
  
    return ul;
  }
  