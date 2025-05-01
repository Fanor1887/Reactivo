import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const appName = 'passport-app';
const baseDir = path.join(process.cwd(), appName);
fs.mkdirSync(baseDir, { recursive: true });

console.log('📁 Generando estructura de archivos...');

// 1. package.json
const packageJson = {
  name: appName,
  version: '1.0.0',
  type: 'module',
  scripts: {
    start: 'node index.js',
  },
  dependencies: {
    express: '^4',
    mongoose: '^7',
    nunjucks: '^3',
    dotenv: '^16',
    passport: '^0.6',
    'passport-local': '^1',
    'express-session': '^1',
    'connect-mongo': '^5',
    bcrypt: '^5',
  },
};
fs.writeFileSync(
  path.join(baseDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// 2. .env
fs.writeFileSync(
  path.join(baseDir, '.env'),
  'MONGO_URI=mongodb://localhost:27017/passportApp\nSESSION_SECRET=secreto\nPORT=3000'
);

// 3. User model
fs.mkdirSync(path.join(baseDir, 'models'));
fs.writeFileSync(
  path.join(baseDir, 'models/User.js'),
  `
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  roles: [String],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
`.trim()
);

// 4. index.js
fs.writeFileSync(
  path.join(baseDir, 'index.js'),
  `
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import MongoStore from 'connect-mongo';

import User from './models/User.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error en MongoDB:', err));

nunjucks.configure('views', { express: app });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'No existe' });
    const match = await user.comparePassword(password);
    return match ? done(null, user) : done(null, false, { message: 'Clave incorrecta' });
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Rutas API
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password, roles: ['user'] });
    await user.save();
    res.json({ message: 'Usuario registrado', user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: 'Login exitoso', user: { username: user.username } });
    });
  })(req, res, next);
});

app.get('/', (req, res) => {
  res.render('index.njk', { user: req.user });
});

app.listen(PORT, () => {
  console.log(\`🚀 Servidor en http://localhost:\${PORT}\`);
});
`.trim()
);

// 5. Vistas
fs.mkdirSync(path.join(baseDir, 'views'));
fs.writeFileSync(
  path.join(baseDir, 'views/index.njk'),
  `
<h1>Bienvenido</h1>
{% if user %}
  <p>Hola, {{ user.username }}!</p>
{% else %}
  <form action="/api/register" method="POST">
    <input name="username" placeholder="Usuario" required />
    <input name="password" placeholder="Clave" type="password" required />
    <button type="submit">Registrar</button>
  </form>
  <form action="/api/login" method="POST">
    <input name="username" placeholder="Usuario" required />
    <input name="password" placeholder="Clave" type="password" required />
    <button type="submit">Iniciar sesión</button>
  </form>
{% endif %}
`.trim()
);

// 6. Public folder
fs.mkdirSync(path.join(baseDir, 'public'));

console.log('📦 Instalando dependencias...');
execSync('npm install', { cwd: baseDir, stdio: 'inherit' });

console.log('✅ Proyecto generado correctamente.');
