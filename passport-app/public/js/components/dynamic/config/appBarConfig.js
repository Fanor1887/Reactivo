

// Configuración
export const appBarConfig = {
  columns: 3,
  styles: {
    backgroundColor: '#6200ea',
 
  },
  elements: [
    {
      type: 'icon',
      content: '≡',
      initialPosition: 0,
      position: 'left top', // Esquina superior izquierda
      styles: { color: 'white', fontSize: '24px' }
    },
    {
      type: 'text',
      content: 'Centrado',
      initialPosition: 1,
      position: 'center middle', // Centro exacto
      styles: { color: 'white', fontWeight: 'bold' }
    },
    {
      type: 'button',
      content: 'Abajo',
      initialPosition: 2,
      position: 'right bottom', // Esquina inferior derecha
      styles: { background: 'white', color: '#6200ea' }
    }
  ]
};

