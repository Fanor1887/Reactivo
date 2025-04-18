// state/sidebarReducer.js
export const initialState = {
  isOpen: false,
  isLoading: false,
  routes: [],
};

export function sidebarReducer(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isOpen: !state.isOpen }; // ← aquí estaba el error

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ROUTES':
      return { ...state, routes: action.payload, isLoading: false };

    default:
      return state;
  }
}
