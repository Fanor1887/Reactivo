import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Configuración de Nunjucks
nunjucks.configure(path.join(__dirname, 'src', 'views'), {
  autoescape: true,
  express: app,
  watch: !isProduction,
});

// Configuración de archivos estáticos
app.use(
  express.static(path.join(__dirname, isProduction ? 'dist' : 'src'), {
    setHeaders: (res, path) => {
      // Header importante para módulos ES
      if (!isProduction && path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    },
  })
);

// Nueva ruta para obtener las rutas del sidebar

// Modifica la ruta principal
app.get('/', (req, res) => {
  res.render('index.njk', {
    title: 'Aplicación Segura Completa',
    isProduction,
    scriptPath: isProduction ? 'bundle.min.js' : 'js/main.js',
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Servidor ${
      isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'
    } en http://localhost:${PORT}`
  );
});
