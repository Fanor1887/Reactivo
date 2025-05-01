export function customIcon(
  iconHTML,
  size = 30,
  color = '#fff',
  customStyles = {}
) {
  const iconContainer = document.createElement('span');
  Object.assign(iconContainer.style, {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.6}px`,
    border: '1px solid white',
    cursor: 'default',
    ...customStyles,
  });

  iconContainer.innerHTML = iconHTML || '';
  return iconContainer;
}
