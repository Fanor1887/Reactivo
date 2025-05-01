import passport from 'passport';

export const isAuthenticated = (req) => {
  return req.isAuthenticated(); // Passport proporciona esta función
};

export const login = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
});

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
};
