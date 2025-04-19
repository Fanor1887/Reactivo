// Función para agregar la animación de rotación
function addSpinAnimation() {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet); // Agregar la animación al head del documento
}

// Función para mostrar el spinner centrado debajo del navbar
export function showSpinner() {
  const navbar = document.getElementById('navbar');
  const content = document.getElementById('content');
  if (!navbar || !content) return;

  let spinner = document.getElementById('spinner');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'spinner';

    addSpinAnimation();

    // Estilo inicial (sin left aún)
    Object.assign(spinner.style, {
      position: 'absolute',
      top: `${navbar.offsetHeight + 10}px`,
      border: '6px solid #3498db',
      borderTop: '6px solid #f3f3f3',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
      zIndex: '1000',
      opacity: '1',
      visibility: 'visible',
    });

    document.body.appendChild(spinner);
  }

  // 💡 Centramos respecto al contenedor #content
  const contentRect = content.getBoundingClientRect();
  const spinnerWidth = spinner.offsetWidth;

  const leftPos = contentRect.left + contentRect.width / 2 - spinnerWidth / 2;
  spinner.style.left = `${leftPos}px`;

  // Mostrar
  spinner.style.visibility = 'visible';
  spinner.style.opacity = '1';
}

export function hideSpinner() {
  const spinner = document.getElementById('spinner');
  if (spinner) {
    // Aplicar el retraso en la desaparición
    spinner.style.opacity = '0'; // Animación de desvanecimiento
    spinner.style.visibility = 'hidden'; // Hacerlo invisible
  }
}

// Suscripción al store (después de asegurarse de que 'store' está inicializado)
// spinner.js
export function initSpinner(store) {
  store.subscribe(() => {
    const state = store.getState();
    console.log('Loading state:', state.ui.loading);

    if (state.ui.loading) {
      showSpinner();
    } else {
      hideSpinner();
    }
  });
}
