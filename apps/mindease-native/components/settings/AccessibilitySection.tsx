import React from "react";
import { View, Text } from "react-native";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OptionCard } from "@/components/ui/OptionCard";
import { ChipSelector } from "@/components/ui/ChipSelector";
import { useAccessibility } from "@/contexts/accessibility-context";
import { useAppColors } from "@/hooks/useAppColors";
import type { ContrastMode, SizeOption } from "@/contexts/accessibility-context";

const FONT_SIZE_OPTIONS: SizeOption[] = ["small", "medium", "large"];
const SPACING_OPTIONS: SizeOption[] = ["small", "medium", "large"];

const FONT_SIZE_LABELS: Record<SizeOption, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
};

const SPACING_LABELS: Record<SizeOption, string> = {
  small: "Compacto",
  medium: "Padrão",
  large: "Espaçoso",
};

interface AccessibilitySectionProps {
  contrastMode: ContrastMode;
  fontSize: SizeOption;
  spacing: SizeOption;
  onContrastChange: (mode: ContrastMode) => void;
  onFontSizeChange: (size: SizeOption) => void;
  onSpacingChange: (size: SizeOption) => void;
}

export function AccessibilitySection({
  contrastMode,
  fontSize,
  spacing,
  onContrastChange,
  onFontSizeChange,
  onSpacingChange,
}: AccessibilitySectionProps) {
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
  const { colors } = useAppColors();

  return (
    <View className="mx-6" style={{ marginBottom: 24 * spacingScale }}>
      <SectionHeader icon="accessibility" title="Acessibilidade" />

      <View
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        style={isHighContrast ? { borderColor: colors.border, borderWidth: 2 } : undefined}
      >
        {/* Contraste */}
        <View
          className="border-b border-gray-50 dark:border-gray-700"
          style={{
            padding: 16 * spacingScale,
            ...(isHighContrast ? { borderBottomColor: colors.border } : {}),
          }}
        >
          <Text
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            style={{ fontSize: 14 * fontScale, color: colors.text, marginBottom: 12 * spacingScale }}
          >
            Contraste
          </Text>
          <View style={{ gap: 12 * spacingScale }}>
            <OptionCard
              icon="contrast"
              title="Baixo Contraste"
              description="Aparência padrão com suavidade visual."
              selected={contrastMode === "low"}
              onPress={() => onContrastChange("low")}
            />
            <OptionCard
              icon="contrast"
              title="Alto Contraste"
              description="Bordas e textos mais fortes para maior legibilidade."
              selected={contrastMode === "high"}
              onPress={() => onContrastChange("high")}
            />
          </View>
        </View>

        {/* Tamanho da Fonte */}
        <View
          className="border-b border-gray-50 dark:border-gray-700"
          style={{
            padding: 16 * spacingScale,
            ...(isHighContrast ? { borderBottomColor: colors.border } : {}),
          }}
        >
          <Text
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            style={{ fontSize: 14 * fontScale, color: colors.text, marginBottom: 12 * spacingScale }}
          >
            Tamanho da Fonte
          </Text>
          <ChipSelector
            options={FONT_SIZE_OPTIONS}
            selected={fontSize}
            onSelect={onFontSizeChange}
            formatLabel={(v) => FONT_SIZE_LABELS[v]}
          />
        </View>

        {/* Espaçamento */}
        <View style={{ padding: 16 * spacingScale }}>
          <Text
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            style={{ fontSize: 14 * fontScale, color: colors.text, marginBottom: 12 * spacingScale }}
          >
            Espaçamento
          </Text>
          <ChipSelector
            options={SPACING_OPTIONS}
            selected={spacing}
            onSelect={onSpacingChange}
            formatLabel={(v) => SPACING_LABELS[v]}
          />
        </View>
      </View>

      <View
        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
        style={{ padding: 12 * spacingScale, marginTop: 12 * spacingScale, ...(isHighContrast ? { borderColor: colors.border } : {}) }}
      >
        <Text className="text-xs text-gray-600 dark:text-gray-300" style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}>
          <Text className="font-bold" style={{ color: colors.text }}>♿ Acessibilidade: </Text>
          Ajuste o contraste, fonte e espaçamento conforme suas necessidades visuais.
        </Text>
      </View>
    </View>
  );
}
