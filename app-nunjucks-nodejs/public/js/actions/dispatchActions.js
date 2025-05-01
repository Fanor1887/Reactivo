import { store } from '../store/index.js'
export const setOperationInProgress = status => ({
  type: 'SET_OPERATION_IN_PROGRESS',
  payload: status
})

export function deleteCookie (name) {
  document.cookie = name + '=; Max-Age=0; path=/' // Elimina la cookie
}
export function setCurrentPath (path) {
  store.dispatch({ type: 'SET_CURRENT_PATH', payload: path })
}
// Función para activar un ítem
export function activateItem (_id) {
  store.dispatch({ type: 'ACTIVATE', payload: { _id } })
}

// Función para desactivar un ítem
export function deactivateItem (_id) {
  store.dispatch({ type: 'DEACTIVATE', payload: { _id } })
}

// Función para actualizar un ítem
export function updateItem (_id, updates) {
  store.dispatch({ type: 'UPDATE', payload: { _id, updates } })
}

// Función para eliminar un ítem
export function deleteItem (_id) {
  store.dispatch({ type: 'DELETE', payload: { _id } })
}

// Función para eliminar múltiples ítems en masa
export function deleteItemsBulk (ids) {
  store.dispatch({ type: 'DELETE_BULK', payload: { ids } })
}
// Acción para actualizar los ítems
export function updateItems (items) {
  return {
    type: 'UPDATE_ITEMS',
    payload: items
  }
}

// Función para hacer logout

export function setApiEndpoint (apiEndpoint) {
  store.dispatch({ type: 'SET_API_ENDPOINT', payload: apiEndpoint })
}

export function setTypeEndpoint (typeEndpoint) {
  store.dispatch({ type: 'SET_TYPE_ENDPOINT', payload: typeEndpoint })
}

export function setApiSubItem (apiSubItem) {
  store.dispatch({ type: 'SET_API_SUBITEM', payload: apiSubItem })
}

// Eliminar un subítem de la lista de ítems en el estado
export function deleteSubItem (itemId, subItemId, subItemField) {
  const state = store.getState().pageData

  // Acceder a la lista de items (ajusta según cómo esté en tu store)
  const items = state.items // O reemplaza 'items' por el nombre correcto

  const updatedItems = items.map(item => {
    if (item._id === itemId) {
      return {
        ...item,
        [subItemField]: item[subItemField].filter(
          subItem => subItem._id !== subItemId
        )
      }
    }
    return item
  })

  return updatedItems
}
