const initialState = {
  loading: false,
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_SPINNER':
      return { ...state, loading: true };
    case 'HIDE_SPINNER':
      return { ...state, loading: false };
    default:
      return state;
  }
}
