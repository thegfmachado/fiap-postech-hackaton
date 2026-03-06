import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useAccessibility } from "@/contexts/accessibility-context";
import { useAppColors } from "@/hooks/useAppColors";

interface ChipSelectorProps<T extends string | number> {
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
  formatLabel?: (value: T) => string;
  scrollable?: boolean;
}

export function ChipSelector<T extends string | number>({
  options,
  selected,
  onSelect,
  formatLabel,
  scrollable = false,
}: ChipSelectorProps<T>) {
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
  const { colors } = useAppColors();
  const label = (v: T) => (formatLabel ? formatLabel(v) : `${v} min`);

  const chips = (
    <View className="flex-row" style={{ gap: 8 * spacingScale }}>
      {options.map((opt) => (
        <TouchableOpacity
          key={String(opt)}
          onPress={() => onSelect(opt)}
          className={`rounded-lg border ${
            selected === opt
              ? "border-primary bg-primary/10"
              : "border-gray-200 dark:border-gray-600"
          }`}
          style={{
            paddingHorizontal: 16 * spacingScale,
            paddingVertical: 8 * spacingScale,
            ...(isHighContrast && selected !== opt ? { borderColor: colors.border } : {}),
          }}
        >
          <Text
            className={`text-sm font-medium ${
              selected === opt
                ? "text-primary"
                : "text-gray-600 dark:text-gray-300"
            }`}
            style={{
              fontSize: 14 * fontScale,
              ...(isHighContrast && selected !== opt ? { color: colors.mutedForeground } : {}),
            }}
          >
            {label(opt)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {chips}
      </ScrollView>
    );
  }

  return chips;
}
