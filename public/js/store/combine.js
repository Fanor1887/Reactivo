import routerReducer from './reducers/routerReducer.js';
import uiReducer from './reducers/uiReducer.js';

export function rootReducer(state = {}, action) {
  return {
    router: routerReducer(state.router, action),
    ui: uiReducer(state.ui, action),
    // auth: authReducer(state.auth, action) <-- cuando lo necesites
  };
}
