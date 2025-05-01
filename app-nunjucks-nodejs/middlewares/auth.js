// auth.js
const isAuthenticated = (req, res, next) => {
  const isLoggedIn = req.session?.user || req.headers['authorization']; // Ejemplo simple

  if (isLoggedIn) {
    return next();
  }

  if (req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  return res.status(401).redirect('/login');
};

export { isAuthenticated };
