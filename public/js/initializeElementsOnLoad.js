import { init } from './init.js';
import { store } from './store/index.js';
import { initSpinner } from './components/common/spinner.js';
import { subscribeNavbar } from './components/common/navbar.js';
import { subscribeSidebar } from './components/common/sidebar.js';
import { setupFooter } from './components/common/footer.js';
// Inicializar los elementos cuando la página esté cargada
export function initializeElementsOnLoad() {
  init(); // Cargar la lógica de inicialización (cargar rutas y almacenarlas en el store)
  initSpinner(store); // Inicializar el spinner, si es necesario

  // Suscribir componentes al store para que se actualicen cuando las rutas cambien

 
}

document.addEventListener('DOMContentLoaded', initializeElementsOnLoad);
