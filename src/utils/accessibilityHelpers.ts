export const handleKeyboardClick = (event: React.KeyboardEvent, onClick: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
};
