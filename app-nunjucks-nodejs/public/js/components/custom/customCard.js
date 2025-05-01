// createCard.js
export function createCard(containerId, options = {}) {
  const cardContainer = document.getElementById(containerId);

  if (!cardContainer) {
    console.error(`No se encontró el contenedor con ID: ${containerId}`);
    return;
  }

  // Crear el elemento de la tarjeta
  const card = document.createElement('div');
  card.className = 'mui-card';

  // Agregar imagen (si se proporciona)
  if (options.imageUrl) {
    const cardImage = document.createElement('img');
    cardImage.src = options.imageUrl;
    cardImage.alt = 'Card Image';
    cardImage.className = 'mui-card-image';
    card.appendChild(cardImage);
  }

  // Crear el contenido de la tarjeta
  const cardContent = document.createElement('div');
  cardContent.className = 'mui-card-content';

  // Título
  const cardTitle = document.createElement('h2');
  cardTitle.textContent = options.title || 'Título de la tarjeta';
  cardTitle.className = 'mui-card-title';
  cardContent.appendChild(cardTitle);

  // Subtítulo
  if (options.subtitle) {
    const cardSubtitle = document.createElement('h3');
    cardSubtitle.textContent = options.subtitle;
    cardSubtitle.className = 'mui-card-subtitle';
    cardContent.appendChild(cardSubtitle);
  }

  // Contenido
  const cardBody = document.createElement('p');
  cardBody.textContent = options.content || 'Contenido de la tarjeta.';
  cardBody.className = 'mui-card-body';
  cardContent.appendChild(cardBody);

  // Botón (si se proporciona)
  if (options.buttonText) {
    const cardButton = document.createElement('button');
    cardButton.textContent = options.buttonText;
    cardButton.className = 'mui-card-button';
    cardButton.addEventListener('click', () => {
      if (options.onButtonClick) {
        options.onButtonClick();
      }
    });
    cardContent.appendChild(cardButton);
  }

  // Añadir el contenido a la tarjeta
  card.appendChild(cardContent);

  // Añadir la tarjeta al contenedor
  cardContainer.appendChild(card);
}
