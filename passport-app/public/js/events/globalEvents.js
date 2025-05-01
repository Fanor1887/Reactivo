// events/globalEvents.js

export function registerGlobalEvents() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('#myButton');
    if (btn) {
      const action = btn.dataset.action || 'sin acción';
      console.log(`Botón clickeado con acción: ${action}`);
      alert(`Disparaste: ${action}`);
    }
  });

  // Puedes agregar más eventos globales aquí si quieres
}
