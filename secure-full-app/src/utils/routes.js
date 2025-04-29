// utils.js
export async function registerRoutes(app, routes) {
  routes.forEach((route) => {
    app.get(route.path, (req, res) => {
      res.render(route.view, {
        title: route.title,
        nonce: res.locals.nonce,
      });
    });

    // Si hay subrutas, llamamos recursivamente
    if (Array.isArray(route.subroutes)) {
      registerRoutes(app, route.subroutes); // llamada recursiva
    }
  });
}
