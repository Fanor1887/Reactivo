// public/js/controllers/login.js
export function setupHomePage() {
  const btn = document.getElementById('myButton');
  if (btn) {
    btn.addEventListener('click', () => {
      console.log('Home button clicked!');
      alert('Ihomi');
    });
  }
}
