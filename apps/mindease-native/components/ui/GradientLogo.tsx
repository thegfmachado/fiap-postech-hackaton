import { LinearGradient } from "expo-linear-gradient";
import { View, Text } from "react-native";
import { useAppColors } from "@/hooks/useAppColors";

const GRADIENT_START_POINT = 0;
const GRADIENT_TRANSITION_POINT = 0.9;

export function GradientLogo() {
  const { isDark } = useAppColors();

  return (
    <LinearGradient
      colors={isDark ? ["#111827", "#142F3D"] : ["#FFFFFF", "#D8FAF0"]}
      className="min-h-[180px] justify-center items-center"
      locations={[GRADIENT_START_POINT, GRADIENT_TRANSITION_POINT]}
    >
      <View className="items-center">
        <Text className="text-4xl font-bold text-primary">MindEase</Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 mt-2">
          Bem-estar mental ao seu alcance
        </Text>
      </View>
    </LinearGradient>
  );
}
