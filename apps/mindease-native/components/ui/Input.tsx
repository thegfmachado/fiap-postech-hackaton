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
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useAppColors();

  const isPassword = showPasswordToggle && secureTextEntry;
  const actualSecureTextEntry = isPassword ? !isPasswordVisible : secureTextEntry;

  const borderColor = isFocused
    ? colors.primary
    : error
    ? colors.destructive
    : colors.border;

  return (
    <View className="mb-4">
      <Text accessibilityRole="text" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </Text>

      <View>
        <TextInput
          {...props}
          accessibilityLabel={label}
          secureTextEntry={actualSecureTextEntry}
          className={`border-2 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
            showPasswordToggle ? 'pr-12' : ''
          } ${className || ''}`}
          style={{ borderColor }}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
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
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
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
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
