import { setupDashboardPage } from './dashboard.js';
import { setupHomePage } from './home.js';

// Centralizamos los controladores en un objeto
export const controllers = {
  '/dashboard': setupDashboardPage,
  '/home': setupHomePage,
};
