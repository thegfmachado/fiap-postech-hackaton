import React from "react";
import { View, Text } from "react-native";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OptionCard } from "@/components/ui/OptionCard";
import type { DisplayMode } from "@/contexts/display-mode-context";

interface DisplayModeSectionProps {
  displayMode: DisplayMode;
  onSelect: (mode: DisplayMode) => void;
}

export function DisplayModeSection({
  displayMode,
  onSelect,
}: DisplayModeSectionProps) {
  return (
    <View className="mx-6 mb-6">
      <SectionHeader icon="visibility" title="Modo de Exibição" />

      <View className="gap-3">
        <OptionCard
          icon="visibility"
          title="Modo Detalhado"
          description="Mostra todas as informações: descrições, botões de ação e contadores de pomodoro."
          selected={displayMode === "detailed"}
          onPress={() => onSelect("detailed")}
        />
        <OptionCard
          icon="visibility-off"
          title="Modo Simplificado"
          description="Reduz estímulos visuais mantendo apenas informações essenciais. Ideal para foco."
          selected={displayMode === "simplified"}
          onPress={() => onSelect("simplified")}
        />
      </View>

      <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mt-3 border border-blue-100 dark:border-blue-800">
        <Text className="text-xs text-gray-600 dark:text-gray-300">
          <Text className="font-bold">ℹ️ Acessibilidade: </Text>
          O modo simplificado foi projetado para pessoas neurodivergentes,
          reduzindo estímulos visuais.
        </Text>
      </View>
    </View>
  );
}
