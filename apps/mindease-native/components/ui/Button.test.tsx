import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  test('should render button with title', () => {
    const { getByText } = render(<Button title="Click me" />);
    
    expect(getByText('Click me')).toBeTruthy();
  });

  test('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Press me" onPress={onPress} />);
    
    fireEvent.press(getByText('Press me'));
    
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('should show loading indicator when loading', () => {
    const { getByTestId } = render(<Button title="Submit" loading />);
    
    expect(getByTestId('button-loading')).toBeTruthy();
  });

  test('should be disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" disabled onPress={onPress} />
    );
    
    const button = getByText('Disabled');
    fireEvent.press(button);
    
    expect(onPress).not.toHaveBeenCalled();
  });

  test('should not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Loading" loading onPress={onPress} />
    );
    
    fireEvent.press(getByText('Loading'));
    
    expect(onPress).not.toHaveBeenCalled();
  });

  test('should render with primary variant by default', () => {
    const { getByText } = render(<Button title="Primary" />);
    
    expect(getByText('Primary')).toBeTruthy();
  });

  test('should render with secondary variant', () => {
    const { getByText } = render(<Button title="Secondary" variant="secondary" />);
    
    expect(getByText('Secondary')).toBeTruthy();
  });

  test('should render with ghost variant', () => {
    const { getByText } = render(<Button title="Ghost" variant="ghost" />);
    
    expect(getByText('Ghost')).toBeTruthy();
  });

  test('should render with small size', () => {
    const { getByText } = render(<Button title="Small" size="sm" />);
    
    expect(getByText('Small')).toBeTruthy();
  });

  test('should render with medium size', () => {
    const { getByText } = render(<Button title="Medium" size="md" />);
    
    expect(getByText('Medium')).toBeTruthy();
  });
});
