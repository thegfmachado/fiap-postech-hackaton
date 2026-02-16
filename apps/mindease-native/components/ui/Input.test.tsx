import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input', () => {
  test('should render input with label', () => {
    const { getByText } = render(<Input label="Email" />);
    
    expect(getByText('Email')).toBeTruthy();
  });

  test('should display error message when error prop is provided', () => {
    const { getByText } = render(
      <Input label="Password" error="Password is required" />
    );
    
    expect(getByText('Password is required')).toBeTruthy();
  });

  test('should call onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input label="Username" placeholder="Enter username" onChangeText={onChangeText} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter username'), 'newuser');
    
    expect(onChangeText).toHaveBeenCalledWith('newuser');
  });

  test('should toggle password visibility when toggle button is pressed', () => {
    const { getByTestId } = render(
      <Input label="Password" secureTextEntry showPasswordToggle />
    );
    
    const toggleButton = getByTestId('password-toggle');
    
    fireEvent.press(toggleButton);
    
    // Should toggle visibility
    expect(toggleButton).toBeTruthy();
  });

  test('should show password toggle button when showPasswordToggle is true', () => {
    const { getByTestId } = render(
      <Input label="Password" secureTextEntry showPasswordToggle />
    );
    
    expect(getByTestId('password-toggle')).toBeTruthy();
  });

  test('should not show password toggle button when showPasswordToggle is false', () => {
    const { queryByTestId } = render(
      <Input label="Email" />
    );
    
    expect(queryByTestId('password-toggle')).toBeNull();
  });

  test('should handle onFocus event', () => {
    const onFocus = jest.fn();
    const { getByPlaceholderText } = render(
      <Input label="Name" placeholder="Enter name" onFocus={onFocus} />
    );
    
    fireEvent(getByPlaceholderText('Enter name'), 'focus');
    
    expect(onFocus).toHaveBeenCalled();
  });

  test('should handle onBlur event', () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <Input label="Name" placeholder="Enter name" onBlur={onBlur} />
    );
    
    fireEvent(getByPlaceholderText('Enter name'), 'blur');
    
    expect(onBlur).toHaveBeenCalled();
  });
});
