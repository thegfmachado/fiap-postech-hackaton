import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { Task, Status } from "@mindease/models";
import { useAccessibility } from "@/contexts/accessibility-context";
import { Column } from "./Column";

const statuses = Object.values(Status);

interface BoardProps {
  tasksByStatus: Record<Status, Task[]>;
  refreshing: boolean;
  onRefresh: () => void;
  onTaskPress: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export function Board({
  tasksByStatus,
  refreshing,
  onRefresh,
  onTaskPress,
  onTaskDelete,
}: BoardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { spacingScale } = useAccessibility();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
      setActiveIndex(page);
    },
    [screenWidth]
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-row items-center justify-center" style={{ gap: 8 * spacingScale, paddingBottom: 12 * spacingScale }}>
        {statuses.map((s, i) => (
          <View
            key={s}
            className={`w-2 h-2 rounded-full ${
              i === activeIndex ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {statuses.map((status) => (
          <View key={status} style={{ width: screenWidth, paddingHorizontal: 16 * spacingScale }}>
            <Column
              status={status}
              tasks={tasksByStatus[status]}
              onTaskPress={onTaskPress}
              onTaskDelete={onTaskDelete}
            />
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
