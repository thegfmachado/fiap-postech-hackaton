import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: { button: 'bg-primary', text: 'text-white font-semibold' },
  secondary: { button: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200 font-semibold' },
  ghost: { button: 'bg-transparent', text: 'text-primary font-medium' },
};

const sizeStyles = {
  sm: { button: 'px-4 py-2', text: 'text-sm' },
  md: { button: 'px-6 py-3', text: 'text-base' },
  lg: { button: 'px-8 py-4', text: 'text-lg' },
};

export function Button({
  title,
  loading = false,
  variant = 'primary',
  size = 'lg',
  disabled,
  className,
  ...props
}: ButtonProps) {
  const { colors } = useAppColors();
  const isDisabled = disabled || loading;
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      className={`rounded-xl items-center justify-center flex-row ${vs.button} ${ss.button} ${isDisabled ? 'opacity-50' : ''} ${className || ''}`}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : colors.primary}
          size="small"
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={`${vs.text} ${ss.text}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
