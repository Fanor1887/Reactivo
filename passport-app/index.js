import express from 'express';
import path from 'path';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import MongoStore from 'connect-mongo';
import User from './models/User.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error en MongoDB:', err));

// Nunjucks
nunjucks.configure('views', {
  express: app,
  autoescape: true,
  watch: true,
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport
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
  console.log('Deserializando usuario:', user); // Agrega un log aquí
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// 🔒 Middleware para proteger las rutas privadas
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next(); // Si el usuario está logueado, pasa al siguiente middleware
  res.redirect('/login'); // Si no está logueado, redirige al login
};

const routes = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config/routes.json'))
);
// 📦 Registrador de rutas recursivo
const registerRoutes = (routesArray, parentPath = '') => {
  routesArray.forEach((route) => {
    const fullPath = parentPath + route.path;

    if (route.path === '/logout') {
      app.get(fullPath, ensureAuth, (req, res, next) => {
        req.logout((err) => {
          if (err) return next(err);
          res.redirect('/login'); // Al hacer logout, redirige a login
        });
      });
    } else {
      const middleware = route.private
        ? ensureAuth // Protege las rutas privadas
        : (req, res, next) => next(); // Permite el acceso a rutas públicas
      app.get(fullPath, middleware, (req, res) => {
        res.render(route.view, { user: req.user }); // Renderiza la vista con los datos del usuario si está autenticado
      });
    }

    if (route.children) {
      registerRoutes(route.children, fullPath); // Llama recursivamente para las subrutas
    }
  });
};
registerRoutes(routes);
// Rutas API

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: 'Credenciales inválidas' });
    req.logIn(user, (err) => {
      if (err) return next(err);
      // Al hacer login, se debería tener acceso a las rutas privadas
      res.json({ message: 'Login exitoso', user: { username: user.username } });
    });
  })(req, res, next);
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password, roles: ['user'] });
    await user.save();
    res.json({
      message: 'Usuario registrado con éxito. Ahora puedes iniciar sesión.',
      user: { username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// 🔁 Rutas recursivas

// API pública que devuelve las rutas visibles (para menú, navbar, etc.)
app.get('/api/routes', (req, res) => {
  const extractRoutes = (routesArray, parentPath = '') => {
    return routesArray.flatMap((route) => {
      const fullPath = parentPath + route.path;

      const current = {
        path: fullPath,
        view: route.view,
        private: route.private,
        title: route.title,
        mdname: route.mdname || '', // opcional si no todos tienen
      };

      const children = route.children
        ? extractRoutes(route.children, fullPath)
        : [];

      return [current, ...children];
    });
  };

  const allRoutes = extractRoutes(routes);
  const userLogged = !!req.user;

  const filteredRoutes = allRoutes.filter((r) =>
    userLogged ? r.private : !r.private
  );

  res.json(filteredRoutes);
});

app.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  } else {
    return res.redirect('/home');
  }
});
app.get('*', (req, res) => {
  res.render('layout.njk', {
    title: 'Mi Aplicación',

    user: req.user || null,
  });
});
app.use((req, res) => {
  if (req.headers.accept?.includes('application/json')) {
    return res.status(404).json({ error: 'Ruta no encontrada' });
  }
  res.status(404).send('<h1>404 - Página no encontrada</h1>');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
