// debug.js
const APP_CONFIG = {
  debugMode: true, // Puedes poner false si no quieres que inicie activado
};

const debugLog = (message, type = 'log') => {
  if (!APP_CONFIG.debugMode) return;

  const debugConsole = document.getElementById('debugConsole');
  if (!debugConsole) return;

  const now = new Date().toLocaleTimeString();
  const msgElement = document.createElement('div');
  msgElement.innerHTML = `[${now}] ${message}`;
  msgElement.style.color =
    type === 'error'
      ? 'red'
      : type === 'warn'
      ? 'yellow'
      : type === 'info'
      ? 'cyan'
      : 'lime';

  debugConsole.appendChild(msgElement);
  debugConsole.scrollTop = debugConsole.scrollHeight;
  console[type](`[DEBUG] ${message}`);
};

// Creación del botón ON/OFF para el modo de depuración
const createDebugUI = () => {
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggleDebug';
  toggleBtn.textContent = 'Debug ON/OFF';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '10px';
  toggleBtn.style.right = '10px';
  toggleBtn.style.padding = '10px 15px';
  toggleBtn.style.backgroundColor = '#333';
  toggleBtn.style.color = 'white';
  toggleBtn.style.border = 'none';
  toggleBtn.style.cursor = 'pointer';
  document.body.appendChild(toggleBtn);

  // Agregar la consola de depuración
  const debugConsole = document.createElement('div');
  debugConsole.id = 'debugConsole';
  debugConsole.style.display = 'none';
  debugConsole.style.position = 'fixed';
  debugConsole.style.bottom = '0';
  debugConsole.style.left = '0';
  debugConsole.style.width = '100%';
  debugConsole.style.maxHeight = '200px';
  debugConsole.style.overflowY = 'auto';
  debugConsole.style.backgroundColor = '#111';
  debugConsole.style.color = '#0f0';
  debugConsole.style.padding = '10px';
  debugConsole.style.fontFamily = 'monospace';
  document.body.appendChild(debugConsole);

  // Activar/desactivar el debug
  toggleBtn.addEventListener('click', () => {
    APP_CONFIG.debugMode = !APP_CONFIG.debugMode;
    debugConsole.style.display = APP_CONFIG.debugMode ? 'block' : 'none';
    debugLog(
      `Debug ${APP_CONFIG.debugMode ? 'activado' : 'desactivado'}`,
      'info'
    );
  });
};

export { debugLog, createDebugUI };
