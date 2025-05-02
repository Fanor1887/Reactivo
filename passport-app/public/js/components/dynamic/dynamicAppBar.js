export function dynamicAppBar (config = {}) {
  const {
    elements = [],
    columns = 3,
    styles = {},
    nestedContainers = true,
    draggable = true,
    ...otherProps
  } = config

  // 1. Analizar distribución real de elementos
  const positionMap = elements.reduce((map, element, index) => {
    const pos =
      element.initialPosition !== undefined ? element.initialPosition : 0
    if (!map.has(pos)) map.set(pos, [])
    map.get(pos).push({ ...element, originalIndex: index })
    return map
  }, new Map())

  // 2. Determinar las posiciones realmente usadas
  const usedPositions = Array.from(positionMap.keys()).sort((a, b) => a - b)
  const totalUsedPositions = usedPositions.length

  // 3. Crear AppBar principal
  const appBar = document.createElement('header')
  appBar.className = 'dynamic-app-bar'

  // 4. Función para calcular el layout de columnas
  const calculateLayout = () => {
    const visibleColumns = Math.min(columns, totalUsedPositions)

    return {
      gridTemplateColumns: `repeat(${visibleColumns}, 1fr)`,
      // Expandir el ancho si hay menos columnas que las configuradas
      width:
        visibleColumns < columns
          ? `${(visibleColumns / columns) * 100}%`
          : '100%'
    }
  }

  // 5. Crear SOLO contenedores necesarios
  const containers = new Map()
  usedPositions.forEach(pos => {
    const container = createContainerElement(pos, {
      nested: nestedContainers,
      isRootContainer: true
    })

    // Agregar todos los elementos de esta posición
    positionMap.get(pos).forEach(element => {
      const elementNode = createDraggableElement(
        element,
        element.originalIndex,
        draggable
      )
      container.appendChild(elementNode)
      setupElementPosition(elementNode, element.position)
    })

    containers.set(pos, container)
    appBar.appendChild(container)
  })

  // 6. Configurar estilos dinámicos
  const layout = calculateLayout()
  Object.assign(appBar.style, {
    display: 'grid',
    gridTemplateColumns: layout.gridTemplateColumns,
    width: '100%',
    gridAutoRows: 'minmax(64px, auto)',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
    zIndex: 999,
    padding: '8px',
    boxSizing: 'border-box',
    position: 'sticky',
    top: 0,
    gap: '8px',
    margin: '0 auto', // Centrar si hay menos columnas
    ...styles
  })

  // 7. API pública que mantiene la integridad de posiciones
  appBar.addElement = elementConfig => {
    const newIndex = elements.length
    elements.push(elementConfig)
    const pos =
      elementConfig.initialPosition !== undefined
        ? elementConfig.initialPosition
        : 0

    // Actualizar el mapa de posiciones
    if (!positionMap.has(pos)) positionMap.set(pos, [])
    positionMap.get(pos).push({ ...elementConfig, originalIndex: newIndex })

    if (containers.has(pos)) {
      // Agregar a contenedor existente
      const elementNode = createDraggableElement(
        elementConfig,
        newIndex,
        draggable
      )
      containers.get(pos).appendChild(elementNode)
      setupElementPosition(elementNode, elementConfig.position)
    } else {
      // Crear nuevo contenedor solo si la posición es necesaria
      const newContainer = createContainerElement(pos, {
        nested: nestedContainers,
        isRootContainer: true
      })
      const elementNode = createDraggableElement(
        elementConfig,
        newIndex,
        draggable
      )
      newContainer.appendChild(elementNode)
      setupElementPosition(elementNode, elementConfig.position)

      containers.set(pos, newContainer)
      appBar.appendChild(newContainer)

      // Recalcular layout
      const newLayout = calculateLayout()
      appBar.style.gridTemplateColumns = newLayout.gridTemplateColumns
      appBar.style.width = newLayout.width
    }
  }

  return appBar
}

function createDraggableElement (config, id, globalDraggable = true) {
  const element = document.createElement('div')
  element.id = `appbar-element-${id}`
  element.className = 'app-bar-element'

  // Configurar contenido según tipo
  switch (config.type) {
    case 'text':
      element.textContent = config.content
      break
    case 'button':
      const button = document.createElement('button')
      button.textContent = config.content
      if (config.action) button.addEventListener('click', config.action)
      element.appendChild(button)
      break
    case 'icon':
      const icon = document.createElement('i')
      icon.className = config.className || ''
      icon.textContent = config.content || ''
      if (config.action) icon.addEventListener('click', config.action)
      element.appendChild(icon)
      break
    case 'custom':
      if (config.render) element.appendChild(config.render())
      break
  }

  // Estilos base del elemento
  Object.assign(element.style, {
    cursor: 'grab',
    userSelect: 'none',
    transition: 'all 0.2s ease',
    position: 'absolute', // Posicionamiento absoluto por defecto
    zIndex: '10',
    ...config.styles
  })

  // 🔹 Evaluar si este elemento debe ser draggable
  const isDraggable =
    config.draggable !== undefined ? config.draggable : globalDraggable

  if (isDraggable) {
    setupFreeDrag(element)
  } else {
    element.style.cursor = 'default'
  }

  return element
}

function setupElementPosition (element, position = 'center') {
  // Resetear estilos primero
  element.style.left = ''
  element.style.right = ''
  element.style.top = ''
  element.style.bottom = ''
  element.style.transform = ''
  element.style.margin = ''

  // Si es string (posición predefinida)
  if (typeof position === 'string') {
    const positions = position.split(' ') // Soporta combinaciones como "left top"

    positions.forEach(pos => {
      switch (pos) {
        case 'left':
          element.style.left = '8px'
          element.style.right = 'auto'
          break
        case 'right':
          element.style.right = '8px'
          element.style.left = 'auto'
          break
        case 'center':
          element.style.left = '50%'
          element.style.right = 'auto'
          element.style.transform = 'translateX(-50%)'
          break
        case 'top':
          element.style.top = '8px'
          element.style.bottom = 'auto'
          break
        case 'bottom':
          element.style.bottom = '8px'
          element.style.top = 'auto'
          break
        case 'middle':
          element.style.top = '50%'
          element.style.bottom = 'auto'
          element.style.transform =
            (element.style.transform || '') + ' translateY(-50%)'
          break
      }
    })
  }
  // Si es objeto (coordenadas exactas)
  else if (typeof position === 'object') {
    if (position.x !== undefined) {
      element.style.left = `${position.x}px`
      element.style.right = 'auto'
    }
    if (position.y !== undefined) {
      element.style.top = `${position.y}px`
      element.style.bottom = 'auto'
    }
  }
}
// Modificamos principalmente la función setupFreeDrag para permitir movimiento entre contenedores
function setupFreeDrag (element) {
  let offsetX, offsetY
  let isDragging = false
  let originalContainer = null

  element.addEventListener('mousedown', e => {
    if (e.button !== 0) return // Solo botón izquierdo

    isDragging = true
    originalContainer = element.parentElement
    const rect = element.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top

    // Estilo durante el arrastre
    element.style.cursor = 'grabbing'
    element.style.zIndex = '100'
    element.style.transition = 'none'
    element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
    element.style.position = 'fixed' // Cambiamos a fixed para mover libremente
    element.style.pointerEvents = 'none' // Evita interferencias durante el arrastre

    // Posición inicial
    element.style.left = `${e.clientX - offsetX}px`
    element.style.top = `${e.clientY - offsetY}px`

    document.addEventListener('mousemove', moveElement)
    document.addEventListener('mouseup', stopDrag)
  })

  function moveElement (e) {
    if (!isDragging) return

    // Mover el elemento con el cursor
    element.style.left = `${e.clientX - offsetX}px`
    element.style.top = `${e.clientY - offsetY}px`

    // Resaltar contenedores potenciales
    const containers = document.querySelectorAll('.app-bar-container')
    containers.forEach(container => {
      const rect = container.getBoundingClientRect()
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        container.style.borderColor = '#6200ea'
        container.style.backgroundColor = 'rgba(98,0,234,0.05)'
      } else {
        container.style.borderColor = 'rgba(0,0,0,0.2)'
        container.style.backgroundColor = 'rgba(0,0,0,0.03)'
      }
    })
  }

  function stopDrag (e) {
    if (!isDragging) return
    isDragging = false

    // Restaurar estilos
    element.style.cursor = 'grab'
    element.style.zIndex = '10'
    element.style.transition = 'all 0.2s ease'
    element.style.boxShadow = ''
    element.style.position = 'absolute'
    element.style.pointerEvents = 'auto'

    // Encontrar el contenedor de destino
    let targetContainer = null
    const containers = document.querySelectorAll('.app-bar-container')
    containers.forEach(container => {
      const rect = container.getBoundingClientRect()
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        targetContainer = container
      }
      // Restaurar estilos de todos los contenedores
      container.style.borderColor = 'rgba(0,0,0,0.2)'
      container.style.backgroundColor = 'rgba(0,0,0,0.03)'
    })

    // Si encontramos un contenedor de destino, mover el elemento allí
    if (targetContainer) {
      targetContainer.appendChild(element)

      // Calcular posición relativa al nuevo contenedor
      const containerRect = targetContainer.getBoundingClientRect()
      const relativeX = e.clientX - containerRect.left - offsetX
      const relativeY = e.clientY - containerRect.top - offsetY

      // Posicionar el elemento en el nuevo contenedor
      element.style.left = `${Math.max(0, relativeX)}px`
      element.style.top = `${Math.max(0, relativeY)}px`
    } else {
      // Si no hay contenedor de destino, volver al original
      originalContainer.appendChild(element)
    }

    document.removeEventListener('mousemove', moveElement)
    document.removeEventListener('mouseup', stopDrag)
  }
}
function createContainerElement (index, options = {}) {
  const { nested = true, isRootContainer = false } = options
  const container = document.createElement('div')
  container.className = 'app-bar-container'
  container.dataset.index = index
  container.dataset.isRoot = isRootContainer

  // Paleta de colores para los IDs (puedes personalizarla)
  const colorPalette = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F06292',
    '#7986CB',
    '#9575CD'
  ]
  const bgColor = colorPalette[index % colorPalette.length]
  const textColor = getContrastColor(bgColor) // Función auxiliar para contraste

  // Estilos base del contenedor con borde del color asignado
  Object.assign(container.style, {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    minHeight: isRootContainer ? '48px' : '32px',
    minWidth: '120px',
    padding: '8px',
    border: `2px dashed ${bgColor}`,
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    overflow: 'visible',
    backgroundColor: 'rgba(0,0,0,0.03)',
    gap: '8px'
  })

  // Badge con ID visible en esquina superior derecha
  const idBadge = document.createElement('div')
  idBadge.textContent = `Col ${index}`
  Object.assign(idBadge.style, {
    position: 'absolute',
    right: '4px',
    top: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: textColor,
    backgroundColor: bgColor,
    padding: '2px 6px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: '10'
  })
  container.appendChild(idBadge)

  // Función auxiliar para determinar color de texto contrastante
  function getContrastColor (hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16)
    const g = parseInt(hexColor.substr(3, 2), 16)
    const b = parseInt(hexColor.substr(5, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }

  // Permitir crear sub-contenedores con doble click
  if (nested) {
    container.addEventListener('dblclick', e => {
      if (e.target === container) {
        const newSubContainer = createContainerElement(0, {
          nested: true,
          isRootContainer: false
        })
        container.appendChild(newSubContainer)
      }
    })
  }

  return container
}
