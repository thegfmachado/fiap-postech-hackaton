import React from "react";
import { View, Text } from "react-native";

interface UserCardProps {
  name: string;
  email: string;
}

export function UserCard({ name, email }: UserCardProps) {
  return (
    <View className="mx-6 mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 flex-row items-center gap-4 border border-gray-100 dark:border-gray-700">
      <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
        <Text className="text-white font-bold text-lg">
          {name?.[0]?.toUpperCase() || "U"}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900 dark:text-gray-100">
          {name || "Usuário"}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">{email}</Text>
      </View>
    </View>
  );
}
