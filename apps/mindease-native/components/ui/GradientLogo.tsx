import { LinearGradient } from "expo-linear-gradient";
import { View, Text } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

const GRADIENT_START_POINT = 0;
const GRADIENT_TRANSITION_POINT = 0.9;

export function GradientLogo() {
  const backgroundColor = useThemeColor({}, 'background');
  const gradientColor = useThemeColor({}, 'gradient');

  return (
    <LinearGradient
      colors={[backgroundColor, gradientColor]}
      className="flex-col grow min-h-48 justify-center items-center"
      locations={[GRADIENT_START_POINT, GRADIENT_TRANSITION_POINT]}
    >
      <View className="items-center">
        <Text className="text-4xl font-bold text-primary">MindEase</Text>
        <Text className="text-lg text-gray-600 mt-2">Bem-estar mental ao seu alcance</Text>
      </View>
    </LinearGradient>
  );
}
