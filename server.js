import express from 'express';
import nunjucks from 'nunjucks';

const app = express();
const PORT = 3000;

// Configurar nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// Ruta principal
app.get('/', (req, res) => {
  res.render('index.njk', {
    titulo: 'Sistema de Fanor',
    mensaje: '¡Bienvenido a tu sistema base con Nunjucks!',
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
