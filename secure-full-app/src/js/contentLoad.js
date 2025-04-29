// contentLoad.js
export function contentLoad(path) {
  const contentArea = document.getElementById('content-area');
  fetch(`/api/page?path=${path}`)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.json();
    })
    .then((data) => {
      contentArea.innerHTML = data.html;
    })
    .catch((error) => {
      contentArea.innerHTML = `<h1>Error al cargar la página</h1><p>${error.message}</p>`;
      console.error('Error al cargar contenido:', error);
    });
}
