export function customNavbar(routes = [], containerId = 'navbar') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`⚠️ No se encontró el contenedor con ID: ${containerId}`);
    return;
  }

  container.innerHTML = ''; // Limpia cualquier contenido previo

  // Crear lista para los links de las rutas
  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';

  // Iterar sobre las rutas y agregarlas como <li>
  routes.forEach((route) => {
    const li = document.createElement('li');
    li.textContent = route.label || route.path;
    ul.appendChild(li);
  });

  // Agregar la lista al contenedor
  container.appendChild(ul);
}
