import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/User.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'No existe' });
      const match = await user.comparePassword(password);
      return match
        ? done(null, user)
        : done(null, false, { message: 'Clave incorrecta' });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
