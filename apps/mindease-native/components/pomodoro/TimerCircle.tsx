import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";

const STROKE_WIDTH = 10;

interface TimerModeConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
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
  const { isDark } = useAppColors();
  const { width: screenWidth } = useWindowDimensions();
  const circleSize = screenWidth * 0.65;
  const radius = (circleSize - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <View className="items-center">
      <View
        className="rounded-3xl items-center py-8 mx-6 w-full"
        style={{ backgroundColor: config.bgColor }}
      >
        <View className="flex-row items-center gap-2 mb-4">
          <MaterialIcons
            name={config.icon as any}
            size={20}
            color={config.color}
          />
          <Text
            style={{ color: config.color }}
            className="text-sm font-semibold"
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
          <Text className="text-5xl font-bold text-gray-900 dark:text-gray-100">
            {timeFormatted}
          </Text>
        </View>

        {children}
      </View>
    </View>
  );
}
