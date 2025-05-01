
const app = document.getElementById('app');

function renderLoginForm() {
  app.innerHTML = `
    <h2>Login</h2>
    <input id="user" placeholder="Usuario" /><br>
    <input id="pass" placeholder="Contraseña" type="password" /><br>
    <button id="loginBtn">Entrar</button>
    <p id="msg"></p>
  `;

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
  app.innerHTML = `
    <h2>Bienvenido ${user.username}</h2>
    <p>Roles: ${user.roles.join(', ')}</p>
    <button id="logoutBtn">Cerrar sesión</button>
  `;

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
