import { store } from '../store/index.js';

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
export function filterByAllowedKeys(items, includedKeys, field = 'path') {
  return items.filter((item) => includedKeys.includes(item[field]));
}

/**
 * Filtra items que NO están en una lista de claves (exclusión)
 * @param {Array} items - Array de objetos
 * @param {Array} excludedKeys - Lista de claves a excluir
 * @param {String} field - Campo del objeto a comparar (por defecto 'path')
 */
export function filterByExcludedKeys(items, excludedKeys, field = 'path') {
  return items.filter((item) => !excludedKeys.includes(item[field]));
}

/**
 * Filtra items que no tienen campo `roles` o tienen alguno que coincida
 * @param {Array} items - Array de objetos
 * @param {Array} userRoles - Lista de roles del usuario
 */
export function filterByRoles(items, userRoles = []) {
  return items.filter(
    (item) => !item.roles || item.roles.some((role) => userRoles.includes(role))
  );
}

/**
 * Filtra items que tienen propiedad booleana activa (por defecto 'private')
 * @param {Array} items - Array de objetos
 * @param {String} flag - Propiedad booleana (por defecto 'private')
 */
export function filterByBooleanFlag(items, flag = 'private') {
  return items.filter((item) => item[flag] === true);
}
