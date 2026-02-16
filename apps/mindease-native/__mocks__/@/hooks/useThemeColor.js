export const useThemeColor = jest.fn((_props, colorName) => {
  // Default color values for testing
  const colors = {
    text: '#000000',
    background: '#FFFFFF',
    tint: '#0000FF',
    icon: '#666666',
    tabIconDefault: '#CCCCCC',
    tabIconSelected: '#0000FF',
    textOnPrimary: '#FFFFFF',
    gradient: '#FF0000',
  };
  
  return colors[colorName] || '#000000';
});
