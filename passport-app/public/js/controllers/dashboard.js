// controllers/login.js

export function setupDashboardPage() {
  console.log('Controlador para la página de Login ejecutado');

  // Aquí agregarás la lógica específica de la página de login
  const loginButton = document.getElementById('my-Button');
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      console.log('Formulario de login enviado');
      alert('Iniciaste sesión.');
      // Aquí pondrás el código de login real, como validación, etc.
    });
  }
}
