// public/js/components/common/navbar.js

export function renderNavbar(routes, loadContentCallback) {
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = ''; // limpiar antes de insertar

  routes.forEach((route) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = route.path;
    a.textContent = route.title;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadContentCallback(route);
    });

    li.appendChild(a);
    navbar.appendChild(li);
  });
}
