import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';
import { useAccessibility } from '@/contexts/accessibility-context';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: { button: 'bg-primary', text: 'text-white font-semibold' },
  secondary: { button: 'bg-gray-100 dark:bg-gray-700', text: 'font-semibold' },
  ghost: { button: 'bg-transparent', text: 'text-primary font-medium' },
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
  const { fontScale, spacingScale } = useAccessibility();
  const isDisabled = disabled || loading;
  const vs = variantStyles[variant];

  const sizeStyle = {
    sm: { paddingHorizontal: 16 * spacingScale, paddingVertical: 8 * spacingScale, fontSize: 14 * fontScale },
    md: { paddingHorizontal: 24 * spacingScale, paddingVertical: 12 * spacingScale, fontSize: 16 * fontScale },
    lg: { paddingHorizontal: 32 * spacingScale, paddingVertical: 16 * spacingScale, fontSize: 18 * fontScale },
  }[size];

  const textColor = variant === 'secondary' ? colors.text : undefined;

  return (
    <TouchableOpacity
      {...props}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={`rounded-xl items-center justify-center flex-row ${vs.button} ${isDisabled ? 'opacity-50' : ''} ${className || ''}`}
      style={{ paddingHorizontal: sizeStyle.paddingHorizontal, paddingVertical: sizeStyle.paddingVertical }}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          accessibilityLabel="Carregando"
          color={variant === 'primary' ? '#FFFFFF' : colors.primary}
          size="small"
          style={{ marginRight: 8 * spacingScale }}
        />
      )}
      <Text
        className={vs.text}
        style={{ fontSize: sizeStyle.fontSize, ...(textColor ? { color: textColor } : {}) }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
