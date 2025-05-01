// api/fetcher.js

export async function fetchData(
  url,
  {
    method = 'GET',
    data = null,
    headers = {},
    credentials = 'include',
    responseType = 'json', // puede ser: json | text | blob
    ...rest
  } = {}
) {
  try {
    const config = {
      method,
      credentials,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Error ${response.status}`);
    }

    // manejar tipos de respuesta
    switch (responseType) {
      case 'text':
        return await response.text();
      case 'blob':
        return await response.blob();
      default:
        return await response.json();
    }
  } catch (error) {
    console.error(`❌ Fetch error [${method} ${url}]:`, error.message);
    throw error;
  }
}
