// utils/eventHelper.js
export function registerEvent(elementSelector, eventType, handler) {
  const element = document.querySelector(elementSelector);
  if (element) {
    element.addEventListener(eventType, handler);
    console.log(`Evento '${eventType}' registrado en: ${elementSelector}`);
  } else {
    console.warn(
      `Elemento '${elementSelector}' no encontrado para el evento '${eventType}'`
    );
  }
}

// utils/eventHelper.js
export function registerEventDelegate(
  containerSelector,
  targetSelector,
  eventType,
  handler
) {
  const container = document.querySelector(containerSelector);
  if (container) {
    container.addEventListener(eventType, (e) => {
      const target = e.target.closest(targetSelector);
      if (target) {
        handler(e, target);
      }
    });
  } else {
    console.warn(
      `Contenedor '${containerSelector}' no encontrado para el evento '${eventType}'`
    );
  }
}
// events/globalEvents.js

// events/globalEvents.js
export function registerGlobalEvents() {
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]'); // Seleccionamos cualquier elemento con 'data-action'
    if (target) {
      const action = target.dataset.action || 'sin acción'; // Obtenemos el valor de 'data-action' o 'sin acción' si no existe
      console.log(`Elemento clickeado con acción: ${action}`);
      alert(`Disparaste: ${action}`);
    }
  });

  // Puedes agregar más eventos globales aquí si lo necesitas
}
