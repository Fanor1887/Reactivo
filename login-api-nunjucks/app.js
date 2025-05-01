
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import nunjucks from 'nunjucks';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import User from './src/models/User.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => console.log('✅ MongoDB conectado'));

app.use(express.json());
app.use(session({ secret: 'clave', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

nunjucks.configure(path.join(__dirname, 'src', 'views'), {
  autoescape: true,
  express: app,
});

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.get('/', (req, res) => {
  res.render('layout.njk');
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: 'Login ok', user });
    });
  })(req, res, next);
});

app.get('/api/logout', (req, res) => {
  req.logout(() => res.json({ message: 'Logout ok' }));
});

app.get('/api/session', (req, res) => {
  if (req.isAuthenticated()) res.json({ user: req.user });
  else res.json({ user: null });
});

app.get('/api/setup', async (req, res) => {
  try {
    const user = await User.register(new User({ username: 'admin', roles: ['admin'] }), 'admin123');
    res.json({ message: 'Usuario creado', user });
  } catch (e) {
    res.json({ message: 'Ya existe' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 http://localhost:${process.env.PORT}`);
});
