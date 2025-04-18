import { store } from '../store/index.js';
import { loadItemsFromAPI } from '../api/itemsApi.js';
import { loadContent } from './storageUtils.js';

export async function handleRouteChange(route) {
  await loadContent(route);

  // Esperar un momento para que los scripts despachen SET_TYPE_ENDPOINT
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { typeEndpoint } = store.getState().pageData;

  if (typeEndpoint) {
    const endpoint =
      typeEndpoint.charAt(0).toUpperCase() + typeEndpoint.slice(1);
    await loadItemsFromAPI(endpoint);
  } else {
    console.warn(
      '⚠️ typeEndpoint no está disponible aún después de cargar el contenido.'
    );
  }
}
