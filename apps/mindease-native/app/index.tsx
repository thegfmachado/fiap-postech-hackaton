import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { useAppColors } from "@/hooks/useAppColors";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { colors } = useAppColors();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, loading, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
