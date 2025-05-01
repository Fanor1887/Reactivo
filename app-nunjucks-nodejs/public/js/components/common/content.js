export function setupContent() {
  const content = document.getElementById('content');
  const container = document.createElement('div');
  container.className = 'container';
  content.appendChild(container); // Inyectamos el <ul> al <nav>
}
