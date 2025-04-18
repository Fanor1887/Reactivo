// js/components/controls/form.js

export function Form({ onSubmit, children }) {
  const form = document.createElement('form');

  // Agregar una clase base de diseño
  form.className = 'form-container';

  // Añadir el evento de submit
  form.addEventListener('submit', onSubmit);

  // Agregar los elementos hijos al formulario (inputs, botones, etc.)
  children.forEach((child) => {
    form.appendChild(child);
  });

  // Estilos predeterminados para el formulario
  const style = document.createElement('style');
  style.textContent = `
    .form-container {
      display: flex;
      flex-direction: column;
      max-width: 500px;
      margin:  auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  
    .form-container input,
    .form-container select,
    .form-container textarea {

      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }

    .form-container button {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }

    .form-container button:hover {
      background-color: #45a049;
    }

    .form-container label {
      margin-bottom: 5px;
      font-weight: bold;
    }

    .form-container .error {
      color: red;
      font-size: 12px;
    }
  `;

  // Incluir los estilos en el documento
  document.head.appendChild(style);

  return form;
}
