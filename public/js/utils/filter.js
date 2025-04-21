

export function filterKeys(object, excludedKeys, allowedKeys = null) {
  return Object.keys(object)
    .filter(
      (key) =>
        !excludedKeys.includes(key) &&
        (allowedKeys === null ||
          allowedKeys.length === 0 ||
          allowedKeys.includes(key))
    )
    .reduce((filtered, key) => {
      filtered[key] = object[key];
      return filtered;
    }, {});
}

// utils/filterRoutes.js// utils/filterUtils.js

/**
 * Filtra items que tienen el campo incluido en una lista de valores
 * @param {Array} items - Array de objetos
 * @param {Array} includedKeys - Lista de claves permitidas
 * @param {String} field - Campo del objeto a comparar (por defecto 'path')
 */
export function filterByKeys(items, keys, field = '', exclude = false) {
  return items.filter(item =>
    exclude
      ? !keys.includes(item[field])  // si exclude es true, excluye los que están en keys
      : keys.includes(item[field])   // si exclude es false (o no se pasa), incluye solo los que están en keys
  );
}


/**
 * Filtra items que tienen una propiedad booleana con cierto valor
 * @param {Array} items - Lista de objetos
 * @param {String} flag - Nombre del campo booleano (por defecto 'private')
 * @param {Boolean} flagValue - Valor a comparar (por defecto true)
 * @returns {Array}
 */
export function filterByBooleanFlag(items, flag = '', flagValue = false) {
  return items.filter((item) => item[flag] === flagValue)
}