export function applyFooterStyles(footer) {
  // Estilos generales del footer
  footer.style.backgroundColor = '#130242';
  footer.style.color = 'white';
  footer.style.textAlign = 'center';
  footer.style.fontSize = '14px';
  footer.style.padding = '20px 0';

  // Contenedor principal
  const footerContainer = document.createElement('div');
  footerContainer.style.margin = '0 auto';
  footerContainer.style.display = 'flex';
  footerContainer.style.justifyContent = 'center';
  footerContainer.style.gap = '20px';
  footerContainer.style.flexWrap = 'nowrap'; // No permitir el wrap en ningún caso

  footer.appendChild(footerContainer);
  footer.style.position = 'relative';
  footer.style.width = '100%';
  footer.style.zIndex = '1000';

  return footerContainer; // Devuelve el contenedor para agregar los elementos dinámicos
}
