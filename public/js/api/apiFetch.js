export async function apiFetch(url, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Comprobamos el tipo de contenido de la respuesta
    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      // Si la respuesta es JSON
      return await response.json();
    } else if (contentType && contentType.includes('text/html')) {
      // Si la respuesta es HTML (como en el caso de las páginas web)
      return await response.text();
    } else {
      // Si no es ni JSON ni HTML, devolvemos el texto crudo
      return await response.text();
    }
  } catch (error) {
    console.error('❌ Error en fetchService:', error);
    throw error;
  }
}
