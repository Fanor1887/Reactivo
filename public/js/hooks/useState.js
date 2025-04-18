// useState.js
const useState = (key, initialValue) => {
  // Recupera el valor del `localStorage` si existe
  const storedValue = localStorage.getItem(key);
  let value = storedValue !== null ? JSON.parse(storedValue) : initialValue;
  const listeners = new Set(); // Usamos un Set para evitar duplicados en los listeners

  const setValue = (newValue) => {
    // Solo actualiza si el valor es diferente
    if (JSON.stringify(value) !== JSON.stringify(newValue)) {
      value = newValue;
      // Almacenar el nuevo valor en `localStorage`
      localStorage.setItem(key, JSON.stringify(value));
      // Notificar a todos los listeners registrados
      listeners.forEach((listener) => listener(value));
    }
  };

  const getValue = () => value;

  const subscribe = (listener) => {
    listeners.add(listener);
    // Devolver una función para cancelar la suscripción
    return () => listeners.delete(listener);
  };

  return [getValue, setValue, subscribe];
};

export default useState;
