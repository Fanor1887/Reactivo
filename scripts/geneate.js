import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const appName = 'login-api-nunjucks';
const base = path.join(process.cwd(), appName);

// 1. Estructura de carpetas
fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'src', 'models'), { recursive: true });
fs.mkdirSync(path.join(base, 'src', 'public'), { recursive: true });
fs.mkdirSync(path.join(base, 'src', 'views'), { recursive: true });

// 2. Archivos: .env
fs.writeFileSync(
  path.join(base, '.env'),
  `PORT=3000\nMONGODB_URI=mongodb://localhost:27017/api_login`
);

// 3. Archivos: package.json + dependencias
fs.writeFileSync(
  path.join(base, 'package.json'),
  JSON.stringify(
    {
      name: appName,
      version: '1.0.0',
      type: 'module',
      scripts: {
        start: 'node app.js',
      },
    },
    null,
    2
  )
);

// 4. app.js
fs.writeFileSync(
  path.join(base, 'app.js'),
  `
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
  console.log(\`🚀 http://localhost:\${process.env.PORT}\`);
});
`
);

// 5. Modelo User.js
fs.writeFileSync(
  path.join(base, 'src', 'models', 'User.js'),
  `
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  roles: [String],
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

export default User;
`
);

// 6. Vistas: layout.njk
fs.writeFileSync(
  path.join(base, 'src', 'views', 'layout.njk'),
  `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>SPA Login</title>
</head>
<body>
  <div id="app"></div>
  <script src="/main.js" defer></script>
</body>
</html>
`
);

// 7. JS cliente
fs.writeFileSync(
  path.join(base, 'src', 'public', 'main.js'),
  `
const app = document.getElementById('app');

function renderLoginForm() {
  app.innerHTML = \`
    <h2>Login</h2>
    <input id="user" placeholder="Usuario" /><br>
    <input id="pass" placeholder="Contraseña" type="password" /><br>
    <button id="loginBtn">Entrar</button>
    <p id="msg"></p>
  \`;

  document.getElementById('loginBtn').onclick = async () => {
    const username = document.getElementById('user').value;
    const password = document.getElementById('pass').value;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) renderDashboard(data.user);
    else document.getElementById('msg').textContent = data.message;
  };
}

function renderDashboard(user) {
  app.innerHTML = \`
    <h2>Bienvenido \${user.username}</h2>
    <p>Roles: \${user.roles.join(', ')}</p>
    <button id="logoutBtn">Cerrar sesión</button>
  \`;

  document.getElementById('logoutBtn').onclick = async () => {
    await fetch('/api/logout');
    renderLoginForm();
  };
}

window.onload = async () => {
  const res = await fetch('/api/session');
  const data = await res.json();
  if (data.user) renderDashboard(data.user);
  else renderLoginForm();
};
`
);

// 8. Instalar dependencias
console.log('📦 Instalando dependencias...');
execSync(
  `cd ${appName} && npm install express mongoose dotenv nunjucks express-session passport passport-local passport-local-mongoose`,
  { stdio: 'inherit' }
);

console.log('✅ Proyecto generado correctamente en: ', base);
