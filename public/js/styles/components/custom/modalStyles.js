export function applyModalStyles(
  modal,
  modalContent,
  overlay,
  sizeModal = 'default'
) {

  // Estilos generales del modal (contenedor)
  Object.assign(modal.style, {
    position: 'fixed',
    top: '50%', // Centrado vertical
    left: '50%', // Centrado horizontal
    transform: 'translate(-50%, -50%)', // Corrección del centrado
    width: '100%', // El contenedor siempre será de tamaño completo
    height: '100%', // El contenedor siempre será de tamaño completo
    backgroundColor: 'rgba(0,0,0,0.7)', // Fondo oscuro
    display: 'none', // Inicialmente oculto
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '2000', // Asegura que el modal esté por encima del overlay
    overflowY: 'auto',
  });

  // Establecer el tamaño del contenido del modal según el valor recibido (sizeModal)
  let contentWidth = '60%'; // Ancho predeterminado
  let contentHeight = 'auto'; // Altura predeterminada

  switch (sizeModal) {
    case 'small':
      contentWidth = '30%';
      contentHeight = 'auto';
      break;
    case 'medium':
      contentWidth = '50%';
      contentHeight = 'auto';
      break;
    case 'large':
      contentWidth = '70%';
      contentHeight = 'auto';
      break;
    case 'fullscreen':
      contentWidth = '100%';
      contentHeight = '100%';
      break;
    case 'half-screen':
      contentWidth = '50%';
      contentHeight = '50%';
      break;
    case 'full-width':
      contentWidth = '100%';
      contentHeight = 'auto';
      break;
    case 'full-height':
      contentWidth = 'auto';
      contentHeight = '100%';
      break;
    case 'xsmall':
      contentWidth = '20%';
      contentHeight = 'auto';
      break;
    case 'xlarge':
      contentWidth = '85%';
      contentHeight = 'auto';
      break;
    case 'custom':
      contentWidth = '800px'; // Ancho personalizado
      contentHeight = '400px'; // Alto personalizado
      break;
    default:
      contentWidth = '60%';
      contentHeight = 'auto';
      break;
  }

  // Estilos del contenido del modal (ahora se aplica al contenido y no al modal general)
  Object.assign(modalContent.style, {
    backgroundColor: '#fff',
    padding: '0',
    borderRadius: '12px',
    width: contentWidth, // El contenido toma el tamaño definido por `sizeModal`
    height: contentHeight, // El contenido toma el tamaño definido por `sizeModal`
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    opacity: '0', // Comienza invisible
    transform: 'scale(0)', // Comienza pequeño
    transition: 'opacity 0.5s ease, transform 0.5s ease', // Transición suave para escala y opacidad
    zIndex: '3000', // Asegura que el contenido del modal esté por encima del overlay
  });

  // Estilos de la superposición (overlay)
  Object.assign(overlay.style, {
    position: 'absolute', // Asegura que el overlay cubra toda la pantalla
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo suave pero oscuro
    opacity: '0', // Comienza invisible
    transition: 'opacity 0.5s ease', // Transición suave para la opacidad
    zIndex: '2000', // Overlay por debajo del contenido del modal
  });
}
