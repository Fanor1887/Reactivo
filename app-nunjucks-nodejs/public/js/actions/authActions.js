import { store } from '../store/index.js';

export const loginSuccess = (user, isAuthenticated, roles) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: { user, isAuthenticated, roles },
  };
};

export const loginFailure = (error) => {
  return {
    type: 'LOGIN_FAILURE',
    payload: error,
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};
export function logoutDispatch() {
  store.dispatch({ type: 'LOGOUT' });
}
export const sessionExpiredAction = () => ({
  type: 'SESSION_EXPIRED',
});
export const setUserRoles = (roles) => {
  return {
    type: 'SET_USER_ROLES',
    payload: roles,
  };
};
