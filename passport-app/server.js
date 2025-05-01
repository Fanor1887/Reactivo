// 🌐 Core
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// 🛢️ Config & DB
import { connectDB } from './config/database.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// 🧠 Autenticación
import passport from 'passport';
import './config/passport.js'; // Separas configuración de passport

// 🖥️ Motor de plantillas
import nunjucks from 'nunjucks';

// 📁 Rutas
import webRoutes from './routes/webRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

// 🧱 App
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// 📡 Conexión Mongo
await connectDB();

// 🖌️ Nunjucks
nunjucks.configure('views', {
  express: app,
  autoescape: true,
  watch: true,
});

// 🛠️ Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🗝️ Sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// 🔐 Passport
app.use(passport.initialize());
app.use(passport.session());

// 🌍 Rutas
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// 🚀 Iniciar servidor
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
