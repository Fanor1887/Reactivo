export default function App(root) {
  // Crear el contenedor principal
  const container = document.createElement('div');
  container.className = 'app-container';

  // Crear el loader (icono de carga)
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = '🔄'; // Usamos un ícono de carga (puedes agregar animación CSS)

  container.appendChild(loader);
  root.appendChild(container);

  // Simular un tiempo de carga
  setTimeout(() => {
    // Eliminar el loader después de la simulación de carga
    loader.style.display = 'none';

    // Crear el contenido principal
    const content = document.createElement('div');
    content.className = 'content';
    
    const heading = document.createElement('h1');
    heading.textContent = '¡Bienvenido a tu App estilo React!';

    const p = document.createElement('p');
    p.textContent = 'Este es un ejemplo simple de cómo construir una SPA sin React, solo usando Vanilla JS.';

    content.appendChild(heading);
    content.appendChild(p);

    // Agregar el contenido principal después del loader
    container.appendChild(content);
  }, 2000); // Tiempo de simulación (2 segundos)
}
