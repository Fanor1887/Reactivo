export function createIcon(
  iconHTML,
  size = 30,
  color = '#fff',
  customStyles = {}
) {
  const iconContainer = document.createElement('span');
  Object.assign(iconContainer.style, {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%', // Forma circular
    backgroundColor: color, // Fondo del ícono
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid white ',
    fontSize: `${size * 0.6}px`, // Tamaño del ícono
    cursor: 'pointer',
    ...customStyles, // Permite estilos personalizados
  });

  iconContainer.innerHTML = iconHTML || ''; // Asigna el ícono si está presente

  return iconContainer;
}
