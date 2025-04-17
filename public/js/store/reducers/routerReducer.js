const initialState = {
  routes: [],
  currentRoute: '/',
};

export default function routerReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_ROUTES':
      return { ...state, routes: action.payload };
    case 'SET_ROUTE':
      return { ...state, currentRoute: action.payload };
    default:
      return state;
  }
}
