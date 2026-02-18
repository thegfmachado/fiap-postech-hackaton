import '@testing-library/jest-native/extend-expect';

// Mock hooks (path aliases não suportam __mocks__/ na raiz)
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
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
  }),
}));

// Mock constants
jest.mock('@/constants/Colors', () => ({
  Colors: {
    light: {
      text: '#11181C',
      background: '#fff',
      tint: '#0a7ea4',
      icon: '#687076',
      tabIconDefault: '#687076',
      tabIconSelected: '#0a7ea4',
      textOnPrimary: '#ffffff',
      gradient: '#0a7ea4',
    },
    dark: {
      text: '#ECEDEE',
      background: '#151718',
      tint: '#fff',
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
      tabIconSelected: '#fff',
      textOnPrimary: '#000000',
      gradient: '#fff',
    },
  },
}));
