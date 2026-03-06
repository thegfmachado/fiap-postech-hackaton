import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
import type { MaterialIconName } from "@/types/icons";

const STROKE_WIDTH = 10;

interface TimerModeConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: MaterialIconName;
}

interface TimerCircleProps {
  config: TimerModeConfig;
  timeFormatted: string;
  progress: number;
  children?: React.ReactNode;
}

export function TimerCircle({
  config,
  timeFormatted,
  progress,
  children,
}: TimerCircleProps) {
  const { isDark, colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
  const { width: screenWidth } = useWindowDimensions();
  const circleSize = screenWidth * 0.65;
  const radius = (circleSize - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <View className="items-center">
      <View
        className="rounded-3xl items-center w-full"
        style={{
          paddingVertical: 32 * spacingScale,
          marginHorizontal: 24 * spacingScale,
          backgroundColor: config.bgColor,
        }}
      >
        <View className="flex-row items-center" style={{ gap: 8 * spacingScale, marginBottom: 16 * spacingScale }}>
          <MaterialIcons
            name={config.icon}
            size={20}
            color={config.color}
          />
          <Text
            style={{ color: config.color, fontSize: 14 * fontScale }}
            className="font-semibold"
          >
            {config.label}
          </Text>
        </View>

        <View
          style={{ width: circleSize, height: circleSize }}
          className="items-center justify-center"
        >
          <Svg
            width={circleSize}
            height={circleSize}
            style={{ position: "absolute" }}
          >
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke={isDark ? "#4B5563" : "#E5E7EB"}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              opacity={isDark ? 0.5 : 0.3}
            />
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke={config.color}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${circleSize / 2}, ${circleSize / 2}`}
            />
          </Svg>
          <Text className="font-bold" style={{ fontSize: 48 * fontScale, color: colors.text }}>
            {timeFormatted}
          </Text>
        </View>

        {children}
      </View>
    </View>
  );
}
