import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  percent: number;
  height?: string;
  color?: string;
}

export function ProgressBar({
  percent,
  height = "h-2",
  color,
}: ProgressBarProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <View className={`${height} bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden`}>
      <View
        className={`${height} rounded-full ${color ? "" : "bg-primary"}`}
        style={{
          width: `${clampedPercent}%`,
          ...(color ? { backgroundColor: color } : {}),
        }}
      />
    </View>
  );
}
