import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppColors } from '@/hooks/useAppColors';
import { useAccessibility } from '@/contexts/accessibility-context';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  showPasswordToggle,
  secureTextEntry,
  className,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useAppColors();
  const { fontScale, spacingScale } = useAccessibility();

  const isPassword = showPasswordToggle && secureTextEntry;
  const actualSecureTextEntry = isPassword ? !isPasswordVisible : secureTextEntry;

  const borderColor = isFocused
    ? colors.primary
    : error
    ? colors.destructive
    : colors.border;

  return (
    <View style={{ marginBottom: 16 * spacingScale }}>
      <Text
        accessibilityRole="text"
        className="font-medium"
        style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.text }}
      >
        {label}
      </Text>

      <View>
        <TextInput
          {...props}
          accessibilityLabel={label}
          secureTextEntry={actualSecureTextEntry}
          className={`border-2 rounded-xl bg-white dark:bg-gray-800 ${
            showPasswordToggle ? 'pr-12' : ''
          } ${className || ''}`}
          style={{
            borderColor,
            paddingHorizontal: 16 * spacingScale,
            paddingVertical: 14 * spacingScale,
            fontSize: 16 * fontScale,
            color: colors.text,
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocusProp?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlurProp?.(e);
          }}
          placeholderTextColor={colors.grayLight}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-3.5 p-1"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons
              name={isPasswordVisible ? 'visibility-off' : 'visibility'}
              size={20}
              color={colors.icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          className="text-red-500"
          style={{ fontSize: 12 * fontScale, marginTop: 4 * spacingScale }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
