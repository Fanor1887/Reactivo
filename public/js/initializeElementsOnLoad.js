import { init } from './init.js';
import { store } from './store/index.js';
import { initSpinner } from './components/common/spinner.js';

export function initializeElementsOnLoad() {
  init();
  initSpinner(store);
}

document.addEventListener('DOMContentLoaded', initializeElementsOnLoad);
