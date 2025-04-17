export function renderFooter(links = []) {
  const footer = document.getElementById('footer');
  footer.innerHTML = ''; // Limpiar contenido anterior

  const year = new Date().getFullYear();

  const linksWrapper = document.createElement('div');
  linksWrapper.className = 'footer-links-container';

  links.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.url;
    a.textContent = link.label;
    a.className = 'footer-link';
    linksWrapper.appendChild(a);
  });

  const copyright = document.createElement('p');
  copyright.innerHTML = `&copy; ${year} Tu Aplicación`;

  footer.appendChild(linksWrapper);
  footer.appendChild(copyright);

  footer.appendChild(linksWrapper);
}
