import './config/index.js';

import './initializeElementsOnLoad.js';
// import { store } from './store/index.js';
// const savedPath = window.location.pathname;
// localStorage.setItem('currentRoute', savedPath); // Asegurar que se guarde en localStorage

// // 🔹 Establecer `currentRoute` en el store global
// store.dispatch({ type: 'SET_ROUTE', payload: savedPath });

// // 🔹 Escuchar cambios en la navegación (botón atrás/adelante del navegador)
// window.addEventListener('popstate', () => {
//   const newPath = window.location.pathname;
//   store.dispatch({ type: 'SET_ROUTE', payload: newPath });
//   localStorage.setItem('currentRoute', newPath); // Sincronizar con localStorage
// });

// // 🔹 Si necesitas sincronizar la UI con `currentRoute`
// store.subscribe(() => {
//   const { currentRoute } = store.getState().router;
//   console.log(`Ruta actual en la app: ${currentRoute}`);

//   // 🔹 Asegurar que `localStorage` se actualice cada vez que cambie `currentRoute`
//   localStorage.setItem('currentRoute', currentRoute);
// });
