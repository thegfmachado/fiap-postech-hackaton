import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input', () => {
  test('should render input with label', () => {
    const { getByText } = render(<Input label="Email" />);

    expect(getByText('Email')).toBeTruthy();
  });

  test('should render input accessible by label', () => {
    const { getByLabelText } = render(
      <Input label="Email" placeholder="Enter email" />
    );

    expect(getByLabelText('Email')).toBeTruthy();
  });

  test('should display error message when error prop is provided', () => {
    const { getByText } = render(
      <Input label="Password" error="Password is required" />
    );

    expect(getByText('Password is required')).toBeTruthy();
  });

  test('should call onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = render(
      <Input label="Username" placeholder="Enter username" onChangeText={onChangeText} />
    );

    fireEvent.changeText(getByLabelText('Username'), 'newuser');

    expect(onChangeText).toHaveBeenCalledWith('newuser');
  });

  test('should toggle password visibility when toggle button is pressed', () => {
    const { getByRole, getByLabelText } = render(
      <Input label="Password" secureTextEntry showPasswordToggle />
    );

    const input = getByLabelText('Password');
    expect(input.props.secureTextEntry).toBe(true);

    fireEvent.press(getByRole('button', { name: 'Mostrar senha' }));

    expect(input.props.secureTextEntry).toBe(false);
  });

  test('should show password toggle button when showPasswordToggle is true', () => {
    const { getByRole } = render(
      <Input label="Password" secureTextEntry showPasswordToggle />
    );

    expect(getByRole('button', { name: 'Mostrar senha' })).toBeTruthy();
  });

  test('should not show password toggle button when showPasswordToggle is false', () => {
    const { queryByRole } = render(<Input label="Email" />);

    expect(queryByRole('button')).toBeNull();
  });

  test('should handle onFocus event', () => {
    const onFocus = jest.fn();
    const { getByLabelText } = render(
      <Input label="Name" placeholder="Enter name" onFocus={onFocus} />
    );

    fireEvent(getByLabelText('Name'), 'focus');

    expect(onFocus).toHaveBeenCalled();
  });

  test('should handle onBlur event', () => {
    const onBlur = jest.fn();
    const { getByLabelText } = render(
      <Input label="Name" placeholder="Enter name" onBlur={onBlur} />
    );

    fireEvent(getByLabelText('Name'), 'blur');

    expect(onBlur).toHaveBeenCalled();
  });
});
