import { rootReducer } from './combine.js';

// Estado inicial y suscripción a los cambios del store
let state = rootReducer(undefined, {});
const listeners = [];

// Función para subscribirse a los cambios del estado
export const store = {
  getState: () => state,

  // Dispatch para actualizar el estado global
  dispatch(action) {
    state = rootReducer(state, action);
    listeners.forEach((listener) => listener());
  },

  // Suscripción para reaccionar a los cambios del estado
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },
};
