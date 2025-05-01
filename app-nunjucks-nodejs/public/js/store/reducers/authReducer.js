const initialAuthState = {
    user: null,
    isAuthenticated: localStorage.getItem('isAuthenticated') || false,
    roles: [], // Añadimos el estado de roles
    error: null,
  };
  
  const authReducer = (state = initialAuthState, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          user: action.payload.user,
          isAuthenticated: action.payload.isAuthenticated,
          roles: action.payload.roles, // Guardamos los roles en el store
          error: null,
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          roles: [], // Limpiamos los roles si hay un fallo en el login
          error: action.payload,
        };
      case 'LOGOUT':
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          roles: [], // Limpiamos los roles al cerrar sesión
          error: null,
        };
      case 'SESSION_EXPIRED':
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          roles: [],
          error: 'La sesión ha expirado.',
        };
      default:
        return state;
    }
  };
  
  export default authReducer;