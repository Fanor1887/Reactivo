const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const nunjucks = require('nunjucks');

// Crear la estructura de directorios si no existe
const viewsDir = path.join(__dirname, 'views');
const routesDir = path.join(__dirname, 'routes');
const publicDir = path.join(__dirname, 'public');

// Crear directorios necesarios
if (!fs.existsSync(viewsDir)) fs.mkdirSync(viewsDir);
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir);
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

// Definir el JSON de rutas dinámicas (este será el archivo que consumimos)
const routes = [
  {
    path: '/home',
    title: 'Inicio',
    view: 'home.njk',
    roleAlias: ['admin', 'doctor'],
    private: false,
    subroutes: [
      {
        path: '/about',
        title: 'Sobre Nosotros',
        view: 'about.njk',
        roleAlias: ['admin', 'doctor'],
        private: false,
      },
    ],
  },
  {
    path: '/login',
    title: 'Iniciar Sesión',
    view: 'login.njk',
    private: false,
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    view: 'dashboard.njk',
    private: true,
    roleAlias: ['admin'],
  },
];

// Función para generar las plantillas .njk
const generateRouteTemplate = (route) => {
  const templatePath = path.join(viewsDir, route.view);
  const dirPath = path.dirname(templatePath);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  if (!fs.existsSync(templatePath)) {
    const templateContent = `
{% extends "layout.njk" %}
{% block content %}
  <h1>${route.title}</h1>
  <p>Ruta: ${route.path}</p>
  <p>Roles permitidos: ${
    route.roleAlias ? route.roleAlias.join(', ') : 'Ninguno'
  }</p>
  {% if route.private %}
    <p><strong>Ruta privada</strong></p>
  {% else %}
    <p><strong>Ruta pública</strong></p>
  {% endif %}
{% endblock %}
    `;
    fs.writeFileSync(templatePath, templateContent, 'utf8');
    console.log(`Plantilla generada para: ${route.path}`);
  }
};

// Generar plantillas para todas las rutas definidas en el JSON
routes.forEach((route) => {
  generateRouteTemplate(route);
  if (route.subroutes) {
    route.subroutes.forEach((subroute) => {
      generateRouteTemplate(subroute);
    });
  }
});

// Crear el archivo layout.njk
const layoutTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>{{ title }}</title>
  <script type="module" src="/js/main.js" defer></script>
  <link rel="stylesheet" href="/css/styles.css" />
</head>
<body>
  <div id="sidebar">
    <div class="sidebar-toolbar">Menú</div>
    <div class="sidebar-content">
      <!-- Aquí van los <ul> con los links -->
    </div>
    <div class="sidebar-footer">© 2025 Tu App</div>
  </div>
  <nav id="navbar"></nav>
  <div id="main">
    <div id="content">
      {% block content %}{% endblock %}
    </div>
    <footer id="footer"></footer>
  </div>
</body>
</html>
`;

const layoutPath = path.join(viewsDir, 'layout.njk');
fs.writeFileSync(layoutPath, layoutTemplate, 'utf8');
console.log('Plantilla layout.njk generada');

// Crear archivo main.js dentro de /public/js
const mainJs = `
console.log("JavaScript cargado correctamente.");
`;

const jsDir = path.join(publicDir, 'js');
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir);
const mainJsPath = path.join(jsDir, 'main.js');
fs.writeFileSync(mainJsPath, mainJs, 'utf8');
console.log('Archivo main.js generado');

// Crear archivo de estilos CSS dentro de /public/css
const stylesCss = `
body {
  font-family: Arial, sans-serif;
}

#sidebar {
  width: 200px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #333;
  color: white;
  height: 100%;
  padding-top: 20px;
}

#sidebar .sidebar-toolbar {
  padding: 10px;
  font-size: 18px;
  text-align: center;
}

#sidebar .sidebar-content {
  margin-top: 20px;
}

#sidebar .sidebar-footer {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
  font-size: 12px;
}

#main {
  margin-left: 220px;
  padding: 20px;
}
`;

const cssDir = path.join(publicDir, 'css');
if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir);
const stylesCssPath = path.join(cssDir, 'styles.css');
fs.writeFileSync(stylesCssPath, stylesCss, 'utf8');
console.log('Archivo styles.css generado');

// Iniciar el servidor con Express y Nunjucks
const app = express();

// Configurar Nunjucks como motor de plantillas
nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
});

// Usar Helmet para configurar seguridad HTTP
app.use(helmet());

// Configurar la carpeta pública para archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static('public'));

// Configurar rutas dinámicas basadas en las rutas definidas
routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.render(route.view, { title: route.title, route });
  });
  if (route.subroutes) {
    route.subroutes.forEach((subroute) => {
      app.get(subroute.path, (req, res) => {
        res.render(subroute.view, { title: subroute.title, route: subroute });
      });
    });
  }
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
