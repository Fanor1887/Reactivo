import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { users } from '../models/userModel.js';

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

export default passport;
