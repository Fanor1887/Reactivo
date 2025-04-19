/**
 * Crea un AppBar genérico reutilizable.
 *
 * @param {string} title - Título o nombre del AppBar.
 * @param {Array} links - Arreglo de objetos { href, text } para los links.
 * @param {string} [containerId] - Opcional. ID del contenedor donde insertar el AppBar.
 */
export function createAppBar(title = 'My App', links, containerId) {
  let appBarContainer;

  if (containerId) {
    appBarContainer = document.getElementById(containerId);
    if (!appBarContainer) {
      console.warn(
        `❗ Contenedor con id "${containerId}" no encontrado. Se creará uno automáticamente.`
      );
    }
  }

  if (!appBarContainer) {
    // Crear contenedor si no existe o no se pasó
    appBarContainer = document.createElement('div');
    appBarContainer.id = 'auto-app-bar-container';
    document.body.insertBefore(appBarContainer, document.body.firstChild);
  }

  // Crear AppBar
  const appBar = document.createElement('header');
  appBar.classList.add('app-bar');

  const appBarInner = document.createElement('div');
  appBarInner.classList.add('app-bar-container');

  const logo = document.createElement('div');
  logo.classList.add('logo');
  logo.innerHTML = `<a href="#">${title}</a>`;

  const navLinks = document.createElement('nav');
  navLinks.classList.add('nav-links');

  const ul = document.createElement('ul');
  links.forEach((link) => {
    const li = document.createElement('li');

    if (link.href) {
      li.innerHTML = `<a href="${link.href}">${link.text}</a>`;
    } else if (link.path) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = link.text;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', link.path);
        // Aquí podrías llamar a un renderizador o disparar un evento de ruta
      });
      li.appendChild(a);
    } else if (link.onAction) {
      const btn = document.createElement('button');
      btn.textContent = link.text;
      btn.classList.add('nav-button');
      btn.addEventListener('click', link.onAction);
      li.appendChild(btn);
    }

    ul.appendChild(li);
  });

  navLinks.appendChild(ul);

  const menuToggle = document.createElement('button');
  menuToggle.classList.add('menu-toggle');
  menuToggle.textContent = '☰';

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  appBarInner.appendChild(logo);
  appBarInner.appendChild(navLinks);
  appBarInner.appendChild(menuToggle);
  appBar.appendChild(appBarInner);
  appBarContainer.appendChild(appBar);
}
