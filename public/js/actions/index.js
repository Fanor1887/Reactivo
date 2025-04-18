// actions.js
export function getAllItems () {
  return { type: 'GET_ALL' }
}
// 2. Funciones de las acciones

// a. Función para crear un ítem
export function createItem (state, payload) {
  const updatedItems = [...state, payload]
  // Guardar los items para la ruta actual en localStorage
  setItemsForPath(state.currentPath, updatedItems)
  return updatedItems
}

// b. Función para actualizar un ítem
export function updateItem (state, payload) {
  const updatedItems = state.map(item =>
    item.id === payload.id ? { ...item, ...payload.updates } : item
  )
  // Guardar los items para la ruta actual en localStorage
  setItemsForPath(state.currentPath, updatedItems)
  return updatedItems
}

// c. Función para eliminar un ítem
export function deleteItem (state, payload) {
  const updatedItems = state.filter(item => item._id !== payload._id) // Usar _id en lugar de id

  return updatedItems
}

// Función para eliminar múltiples ítems
export function deleteItemsBulk (state, payload) {
  const updatedItems = state.filter(item => !payload.ids.includes(item._id))

  return updatedItems
}

// d. Función para activar un ítem
export function activateItem (state, payload) {
  const updatedItems = state.map(item =>
    item.id === payload.id ? { ...item, active: true } : item
  )
  // Guardar los items para la ruta actual en localStorage
  setItemsForPath(state.currentPath, updatedItems)
  return updatedItems
}

// e. Función para desactivar un ítem
export function deactivateItem (state, payload) {
  const updatedItems = state.map(item =>
    item.id === payload.id ? { ...item, active: false } : item
  )
  // Guardar los items para la ruta actual en localStorage
  setItemsForPath(state.currentPath, updatedItems)
  return updatedItems
}

// f. Función para obtener los ítems basados en `currentPath`
export function getItemsForPath (path) {
  // Intenta obtener los ítems del localStorage basados en `currentPath`
  const items = JSON.parse(localStorage.getItem(path)) || []
  return items
}

// g. Función para establecer los ítems basados en `currentPath` en localStorage
export function setItemsForPath (state) {
  // Guardamos los ítems de la ruta específica en el localStorage
  localStorage.setItem('items', JSON.stringify(state.pageData.items))
  localStorage.setItem('currentPath', state.pageData.currentPath)
}

// h. Función para actualizar solo el `currentPath` y cargar los ítems
export function setCurrentPath (state, path) {
  if (state.currentPath === path) {
    return state // No actualizamos nada si la ruta es la misma
  }

  // Activar el estado de carga antes de cambiar la ruta
  const newState = { ...state, loading: true }

  // Cargar los ítems para la nueva ruta
  const items = getItemsForPath(state.items) // Obtener ítems de `localStorage` o de la API
  const updatedState = {
    ...newState,
    currentPath: path,
    items: items, // Establecemos los ítems cargados
    loading: false // Desactivar el estado de carga
  }

  // Actualiza la URL en el navegador sin recargar la página
  window.history.pushState({}, '', path)

  return updatedState
}
// i. Función para eliminar un subitem (por ejemplo, un permiso dentro de un rol)
export function deleteSubItem (state, payload) {
  const { itemId, subItemId, subItemField } = payload

  const updatedItems = state.map(item => {
    if (item._id === itemId) {
      return {
        ...item,
        [subItemField]: item[subItemField].filter(sub => sub._id !== subItemId)
      }
    }
    return item
  })

  // Guardar en localStorage para persistencia
  setItemsForPath({
    pageData: { currentPath: state.currentPath, items: updatedItems }
  })

  return updatedItems
}
