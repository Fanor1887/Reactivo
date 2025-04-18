// js/components/controls/card.js

/**
 * Crea una tarjeta (card) con un encabezado, cuerpo y pie de página.
 * @param {Object} options - Opciones para la tarjeta.
 * @param {string|HTMLElement} options.cardHeader - Contenido del encabezado de la tarjeta.
 * @param {string|HTMLElement} options.cardBody - Contenido del cuerpo de la tarjeta.
 * @param {string|HTMLElement} options.cardFooter - Contenido del pie de página de la tarjeta.
 * @param {Object} styles - Estilos personalizados para la tarjeta.
 * @returns {Object} - Un objeto con la tarjeta y su contenedor.
 */
export function CreateCard(
  { cardHeader, cardBody, cardFooter } = {},
  styles = {}
) {
  // Estilos por defecto
  const defaultStyles = {
    cardContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px',
    },
    card: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',

      overflow: 'hidden',
    },
    header: {
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #ccc',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    body: {
      padding: '25px ',
    },
    footer: {
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #ccc',
      textAlign: 'center',
    },
  };

  // Combinar estilos por defecto con estilos personalizados
  const combinedStyles = {
    cardContainer: { ...defaultStyles.cardContainer, ...styles.cardContainer },
    card: { ...defaultStyles.card, ...styles.card },
    header: { ...defaultStyles.header, ...styles.header },
    body: { ...defaultStyles.body, ...styles.body },
    footer: { ...defaultStyles.footer, ...styles.footer },
  };

  // Crear el contenedor de la tarjeta
  const cardContainer = document.createElement('div');
  Object.assign(cardContainer.style, combinedStyles.cardContainer);

  // Crear la tarjeta
  const card = document.createElement('div');
  Object.assign(card.style, combinedStyles.card);

  // Crear el encabezado de la tarjeta (si se proporciona)
  if (cardHeader) {
    const header = document.createElement('div');
    Object.assign(header.style, combinedStyles.header);
    if (typeof cardHeader === 'string') {
      header.textContent = cardHeader;
    } else {
      header.appendChild(cardHeader);
    }
    card.appendChild(header);
  }

  // Crear el cuerpo de la tarjeta (si se proporciona)
  if (cardBody) {
    const body = document.createElement('div');
    Object.assign(body.style, combinedStyles.body);
    if (typeof cardBody === 'string') {
      body.textContent = cardBody;
    } else {
      body.appendChild(cardBody);
    }
    card.appendChild(body);
  }

  // Crear el pie de página de la tarjeta (si se proporciona)
  if (cardFooter) {
    const footer = document.createElement('div');
    Object.assign(footer.style, combinedStyles.footer);
    if (typeof cardFooter === 'string') {
      footer.textContent = cardFooter;
    } else {
      footer.appendChild(cardFooter);
    }
    card.appendChild(footer);
  }

  // Agregar la tarjeta al contenedor
  cardContainer.appendChild(card);

  // Devolver el contenedor y la tarjeta
  return {
    cardContainer, // El contenedor de la tarjeta
    card, // La tarjeta en sí
  };
}
