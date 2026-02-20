import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  test('should render button with title', () => {
    const { getByRole } = render(<Button title="Click me" />);

    expect(getByRole('button', { name: 'Click me' })).toBeTruthy();
  });

  test('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button title="Press me" onPress={onPress} />);

    fireEvent.press(getByRole('button', { name: 'Press me' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('should show loading indicator when loading', () => {
    const { getByLabelText } = render(<Button title="Submit" loading />);

    expect(getByLabelText('Carregando')).toBeTruthy();
  });

  test('should be disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button title="Disabled" disabled onPress={onPress} />
    );

    const button = getByRole('button', { name: 'Disabled' });
    fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
  });

  test('should have disabled accessibility state when disabled', () => {
    const { getByRole } = render(<Button title="Disabled" disabled />);

    const button = getByRole('button', { name: 'Disabled' });
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  test('should have busy accessibility state when loading', () => {
    const { getByRole } = render(<Button title="Loading" loading />);

    const button = getByRole('button', { name: 'Loading' });
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ busy: true })
    );
  });

  test('should not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button title="Loading" loading onPress={onPress} />
    );

    fireEvent.press(getByRole('button', { name: 'Loading' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  test('should render with primary variant by default', () => {
    const { getByRole } = render(<Button title="Primary" />);

    expect(getByRole('button', { name: 'Primary' })).toBeTruthy();
  });

  test('should render with secondary variant', () => {
    const { getByRole } = render(<Button title="Secondary" variant="secondary" />);

    expect(getByRole('button', { name: 'Secondary' })).toBeTruthy();
  });

  test('should render with ghost variant', () => {
    const { getByRole } = render(<Button title="Ghost" variant="ghost" />);

    expect(getByRole('button', { name: 'Ghost' })).toBeTruthy();
  });

  test('should render with small size', () => {
    const { getByRole } = render(<Button title="Small" size="sm" />);

    expect(getByRole('button', { name: 'Small' })).toBeTruthy();
  });

  test('should render with medium size', () => {
    const { getByRole } = render(<Button title="Medium" size="md" />);

    expect(getByRole('button', { name: 'Medium' })).toBeTruthy();
  });
});
