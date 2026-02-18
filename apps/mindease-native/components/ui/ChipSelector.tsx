import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

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
  const label = (v: T) => (formatLabel ? formatLabel(v) : `${v} min`);

  const chips = (
    <View className="flex-row gap-2">
      {options.map((opt) => (
        <TouchableOpacity
          key={String(opt)}
          onPress={() => onSelect(opt)}
          className={`px-4 py-2 rounded-lg border ${
            selected === opt
              ? "border-primary bg-primary/10"
              : "border-gray-200 dark:border-gray-600"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selected === opt
                ? "text-primary"
                : "text-gray-600 dark:text-gray-300"
            }`}
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
