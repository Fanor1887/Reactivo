document.addEventListener('DOMContentLoaded', function () {
  const loginContainer = document.getElementById('login-container');

  if (loginContainer && !loginContainer.querySelector('form')) {
    const form = document.createElement('form');
    form.id = 'login-form';

    form.innerHTML = `
      <h1>Iniciar Sesión</h1>
      <div>
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required />
      </div>
      <button type="submit">Iniciar sesión</button>
    `;

    loginContainer.appendChild(form);

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (!username || !password) {
        alert('Por favor, complete todos los campos.');
        return;
      }

      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Inicio de sesión exitoso');
            window.location.href = '/dashboard'; // Redirigir a una página protegida
          } else {
            alert('Credenciales incorrectas');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Hubo un error al intentar iniciar sesión');
        });
    });
  }
});
