// public/js/apiFetch.js

export async function apiFetch(method, url, data = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const options = {
    method: method.toUpperCase(), // 'GET', 'POST', etc.
    headers: headers,
  };

  // Si es un POST o PUT, agregamos el cuerpo
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    // Verifica si la respuesta fue exitosa (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Si el método es GET o no requiere cuerpo, retornamos la respuesta en formato JSON
    if (method.toUpperCase() === 'GET') {
      return await response.json();
    }

    // Si es un POST, PUT o DELETE, retornamos la respuesta (o cualquier dato que desee manejar)
    return await response.json(); // Aquí puedes ajustar según lo que necesitas.
  } catch (error) {
    console.error('Error en la solicitud API:', error);
    throw error;
  }
}
