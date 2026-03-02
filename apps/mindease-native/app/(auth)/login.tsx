import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginSchema } from "@mindease/validation-schemas";
import { useAuth } from "@/contexts/auth-context";
import { GradientLogo } from "@/components/ui/GradientLogo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        setErrorMsg("Email ou senha incorretos. Tente novamente.");
        setShowError(true);
      } else {
        router.replace("/(tabs)/home");
      }
    } catch {
      setErrorMsg("Ocorreu um erro ao fazer login. Tente novamente.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <GradientLogo />

          <View className="px-6 pt-8 pb-6 flex-1">
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Entrar na sua conta
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 mb-8">
              Digite seu email e senha para acessar o MindEase
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  placeholder="Digite sua senha"
                  secureTextEntry
                  showPasswordToggle
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              className="self-end mb-6"
            >
              <Text className="text-primary text-sm font-medium">
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            <Button
              title="Entrar"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
            />

            <View className="flex-row items-center justify-center mt-6 gap-1">
              <Text className="text-gray-500 dark:text-gray-400">Ainda não tem uma conta?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text className="text-primary font-semibold">Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={showError}
        title="Erro"
        message={errorMsg}
        confirmLabel="OK"
        infoOnly
        onConfirm={() => setShowError(false)}
        onCancel={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
