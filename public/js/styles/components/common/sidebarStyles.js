// sidebarStyles.js

export function applySidebarStyles (
  side,
  content,
  navbar,
  footer,
  isSidebarOpen,
  isMobile,
  isAuthenticated
) {
  side.style.position = 'fixed' // Sidebar siempre fijo en la pantalla
  side.style.left = '0' // Sidebar alineado a la izquierda
  side.style.width = '250px' // Ancho fijo
  side.style.top = `${navbar.offsetHeight}px`

  // Ajustar la altura sin exceder la pantalla
  side.style.height = `calc(100vh - ${
    navbar.offsetHeight + footer.offsetHeight
  }px)`

  side.style.zIndex = '1000'
  side.style.padding = '10px'
  side.style.border = '1px solid yellow'
  side.style.backgroundColor = 'blue'
  side.style.flexDirection = 'column'

  // Asegurar el desplazamiento correcto dentro del sidebar
  side.style.overflowY = 'auto' // Habilita scroll si hay contenido extra
  side.style.overflowX = 'hidden' // Evita desplazamiento horizontal

  side.style.transition = 'transform 0.3s ease'
  content.style.transition = 'margin-left 0.3s ease'

  // Mover el contenido en escritorio
  if (isMobile) {
    content.style.marginLeft = '0' // El contenido no se moverá en móviles
    side.style.transform = isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
  } else if (isAuthenticated) {
    content.style.marginLeft = '270px' // Mover el contenido en escritorio
    side.style.transform = isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
  } else {
    side.style.marginLeft = '-270px'
    content.style.marginLeft = '0' // El contenido no se moverá en escritorio
  }

  console.log(
    'applySidebarStyles: content.style.marginLeft',
    content.style.marginLeft
  )
}
