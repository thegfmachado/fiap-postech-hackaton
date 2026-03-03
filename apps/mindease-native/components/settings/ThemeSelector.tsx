import React from "react";
import { View } from "react-native";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OptionCard } from "@/components/ui/OptionCard";
import { useAccessibility } from "@/contexts/accessibility-context";

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
  const { spacingScale } = useAccessibility();

  return (
    <View className="mx-6" style={{ marginBottom: 24 * spacingScale }}>
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
