import fs from 'fs'
import path from 'path'

// Nombre de la carpeta principal del proyecto
const projectFolder = 'aplicationRoutes'

// Función para crear carpetas de manera recursiva
function createDirSync (dirPath) {
  const dirs = dirPath.split(path.sep)
  let currentPath = ''

  dirs.forEach(dir => {
    currentPath = path.join(currentPath, dir)
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath)
    }
  })
}

// Crear la estructura de carpetas
createDirSync(projectFolder)
createDirSync(path.join(projectFolder, 'src'))
createDirSync(path.join(projectFolder, 'src', 'config'))
createDirSync(path.join(projectFolder, 'src', 'controllers'))
createDirSync(path.join(projectFolder, 'public'))
createDirSync(path.join(projectFolder, 'public', 'js'))
createDirSync(path.join(projectFolder, 'public', 'js', 'navigation'))
createDirSync(path.join(projectFolder, 'views'))
createDirSync(path.join(projectFolder, 'views', 'layouts'))
createDirSync(path.join(projectFolder, 'views', 'partials'))
createDirSync(path.join(projectFolder, 'views', 'pages'))
createDirSync(path.join(projectFolder, 'views', 'pages', 'publicPages'))
createDirSync(path.join(projectFolder, 'views', 'pages', 'privatePages'))
createDirSync(path.join(projectFolder, 'views', 'errors'))

// Crear el archivo server.js
const serverJS = `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './src/config/routes.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

function flattenRoutes(routesArray, parentPath = '') {
  return routesArray.reduce((acc, route) => {
    const fullPath = path.posix.join(parentPath, route.path);
    acc.push({
      path: fullPath,
      view: route.view,
      private: route.private,
      roles: route.roleAlias || []
    });
    
    if (route.subroutes) {
      acc.push(...flattenRoutes(route.subroutes, fullPath));
    }
    return acc;
  }, []);
}

const flattenedRoutes = flattenRoutes(routes.routes);

app.use((req, res, next) => {
  req.user = { role: 'doctor' }; // Simulación de usuario, reemplazar con tu lógica de autenticación
  next();
});

flattenedRoutes.forEach(route => {
  app.get(route.path, (req, res) => {
    if (route.private && !req.isAuthenticated()) {
      return res.redirect('/login');
    }

    if (route.roles.length > 0 && !route.roles.includes(req.user.role)) {
      return res.status(403).render('errors/403.njk');
    }

    res.render(route.view, { currentPath: route.path, user: req.user });
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
`

fs.writeFileSync(path.join(projectFolder, 'server.js'), serverJS)

// Crear el archivo routes.json
const routesJSON = {
  routes: [
    {
      path: '/',
      title: 'Home',
      view: 'home.njk',
      roleAlias: ['admin', 'user'],
      private: false,
      subroutes: []
    },
    {
      path: '/dashboard',
      title: 'Dashboard',
      view: 'dashboard.njk',
      roleAlias: ['admin'],
      private: true,
      subroutes: []
    },
    {
      path: '/login',
      title: 'Login',
      view: 'login.njk',
      roleAlias: [],
      private: false,
      subroutes: []
    }
  ]
}

fs.writeFileSync(
  path.join(projectFolder, 'src', 'config', 'routes.json'),
  JSON.stringify(routesJSON, null, 2)
)

// Crear el archivo DynamicRouter.js
const dynamicRouterJS = `
export const appRoutes = ${JSON.stringify(routesJSON.routes, null, 2)};
`

fs.writeFileSync(
  path.join(projectFolder, 'public', 'js', 'navigation', 'DynamicRouter.js'),
  dynamicRouterJS
)

// Crear el archivo menuBuilder.js
const menuBuilderJS = `
export function buildMenu(routes, userRole) {
  const menuContainer = document.getElementById('main-menu');

  function createMenuItems(items, parentPath = '') {
    return items.map(item => {
      if (item.private && !userRole) return '';
      if (item.roles && !item.roles.includes(userRole)) return '';

      const fullPath = \`\${parentPath}\${item.path}\`;
      const hasChildren = item.subroutes && item.subroutes.length > 0;

      return \`
        <li class="menu-item \${hasChildren ? 'has-submenu' : ''}">
          <a href="\${fullPath}" data-navigation>
            \${item.title}
            \${hasChildren ? '<span class="dropdown-icon">▼</span>' : ''}
          </a>
          \${hasChildren ? \`<ul class="submenu">\${createMenuItems(item.subroutes, fullPath)}</ul>\` : ''}
        </li>
      \`;
    }).join('');
  }

  menuContainer.innerHTML = \`
    <ul class="main-menu">
      \${createMenuItems(routes)}
    </ul>
  \`;
}
`

fs.writeFileSync(
  path.join(projectFolder, 'public', 'js', 'navigation', 'menuBuilder.js'),
  menuBuilderJS
)

// Crear el archivo route-info.njk (layout)
const routeInfoNJK = `
<div class="route-container" data-route="{{ currentPath }}">
  <aside class="sidebar">
    {% include "partials/menu.njk" %}
  </aside>
  
  <main class="main-content">
    {% block content %}{% endblock %}
  </main>
</div>
`

fs.writeFileSync(
  path.join(projectFolder, 'views', 'layouts', 'route-info.njk'),
  routeInfoNJK
)

// Crear el archivo menu.njk (partial)
const menuNJK = `
<ul id="main-menu">
  <!-- Menu generado dinámicamente -->
</ul>
`

fs.writeFileSync(
  path.join(projectFolder, 'views', 'partials', 'menu.njk'),
  menuNJK
)

// Crear el archivo dashboard.njk
const dashboardNJK = `
{% extends "layouts/route-info.njk" %}

{% block content %}
  <h1>Dashboard</h1>
  <p>Contenido del Dashboard</p>
{% endblock %}
`

fs.writeFileSync(
  path.join(projectFolder, 'views', 'pages', 'privatePages', 'dashboard.njk'),
  dashboardNJK
)

// Crear el archivo login.njk
const loginNJK = `
{% extends "layouts/route-info.njk" %}

{% block content %}
  <h1>Login</h1>
  <p>Formulario de login</p>
{% endblock %}
`

fs.writeFileSync(
  path.join(projectFolder, 'views', 'pages', 'publicPages', 'login.njk'),
  loginNJK
)

// Crear archivos de error (404, 403, 500)
const errorNJK = `
{% extends "layouts/route-info.njk" %}

{% block content %}
  <h1>Error</h1>
  <p>Ha ocurrido un error.</p>
{% endblock %}
`

fs.writeFileSync(
  path.join(projectFolder, 'views', 'errors', '500.njk'),
  errorNJK
)
fs.writeFileSync(
  path.join(projectFolder, 'views', 'errors', '404.njk'),
  errorNJK
)
fs.writeFileSync(
  path.join(projectFolder, 'views', 'errors', '403.njk'),
  errorNJK
)

console.log('✅ Proyecto generado en la carpeta "aplicationRoutes"')
