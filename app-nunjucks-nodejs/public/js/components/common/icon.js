export function createIcon(
  iconHTML,
  size = 30,
  color = '#fff',
  shape = 'circle'
) {
  const iconContainer = document.createElement('span');
  iconContainer.style.width = `${size}px`;
  iconContainer.style.height = `${size}px`;
  iconContainer.style.display = 'flex';
  iconContainer.style.alignItems = 'center';
  iconContainer.style.justifyContent = 'center';
  iconContainer.style.fontSize = `${size * 0.6}px`; // Ajusta el tamaño del ícono
  iconContainer.style.color = 'black'; // Color del ícono
  iconContainer.style.backgroundColor = color; // Color de fondo

  // Aplicar la forma según el parámetro `shape`
  if (shape === 'circle') {
    iconContainer.style.borderRadius = '50%'; // Forma redonda
  } else if (shape === 'square') {
    iconContainer.style.borderRadius = '5px'; // Bordes levemente redondeados
  } else if (shape === 'triangle') {
    iconContainer.style.fontSize = `${size}px`; // Ajusta el tamaño del ícono
    iconContainer.style.width = '0';
    iconContainer.style.height = '0';
 iconContainer.style.borderLeft = `${size / 2}px solid transparent`;
 iconContainer.style.borderRight = `${size / 2}px solid transparent`;
 iconContainer.style.borderTop = `${size}px solid ${color}`; // Triángulo invertido
 iconContainer.style.backgroundColor = 'transparent';
  }

  // Solo agregar contenido si no es triángulo (porque el triángulo usa solo CSS)
  if (shape !== 'triangle') {
    iconContainer.innerHTML = iconHTML ? iconHTML : ''; // Asigna el ícono si está presente
  }

  return iconContainer;
}
