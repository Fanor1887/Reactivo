document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Evitar el envío tradicional del formulario

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }), // Enviar los datos como JSON
    credentials: 'include', // Mantener la sesión
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === 'Autenticación exitosa') {
        // Formatear y mostrar los datos del usuario
        const user = data.user;
        const userInfo = `
          <h3>Bienvenido, ${user.username}</h3>
          <p>ID: ${user.id}</p>
          <p>Roles: ${user.roles.join(', ')}</p>
        `;

        // Mostrar la información del usuario en el frontend
        document.getElementById('user-info').innerHTML = userInfo;

        // Redirigir al dashboard
        window.location.href = '/dashboard'; // Redirigir al dashboard o página principal
      } else {
        document.getElementById('error-message').style.display = 'block'; // Mostrar mensaje de error si no es exitoso
      }
    })
    .catch((err) => {
      console.error('Error al iniciar sesión:', err);
      document.getElementById('error-message').style.display = 'block'; // Mostrar error si ocurre algo inesperado
    });
});
