import React from "react";
import { View } from "react-native";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OptionCard } from "@/components/ui/OptionCard";

interface ThemeSelectorProps {
  isDark: boolean;
  onSelectLight: () => void;
  onSelectDark: () => void;
}

export function ThemeSelector({
  isDark,
  onSelectLight,
  onSelectDark,
}: ThemeSelectorProps) {
  return (
    <View className="mx-6 mb-6">
      <SectionHeader icon="palette" title="Tema" />
      <View className="gap-3">
        <OptionCard
          icon="light-mode"
          title="Modo Claro"
          description="Fundo claro com texto escuro. Ideal para ambientes iluminados."
          selected={!isDark}
          onPress={onSelectLight}
        />
        <OptionCard
          icon="dark-mode"
          title="Modo Escuro"
          description="Fundo escuro que reduz a fadiga visual. Ideal para uso noturno."
          selected={isDark}
          onPress={onSelectDark}
        />
      </View>
    </View>
  );
}
