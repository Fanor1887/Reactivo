import routerReducer from './reducers/routerReducer.js';
import { sidebarReducer } from './reducers/sidebarReducer.js';
import uiReducer from './reducers/uiReducer.js';

export function rootReducer(state = {}, action) {
  return {
    router: routerReducer(state.router, action),
    ui: uiReducer(state.ui, action),
    sidebar: sidebarReducer(state.sidebar, action),
    // auth: authReducer(state.auth, action) <-- cuando lo necesites
  };
}
