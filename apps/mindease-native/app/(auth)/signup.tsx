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

import { signupSchema, type SignupSchema } from "@mindease/validation-schemas";
import { useAuth } from "@/contexts/auth-context";
import { GradientLogo } from "@/components/ui/GradientLogo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignupSchema) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.name, data.email, data.password);
      if (error) {
        setModalTitle("Erro");
        setModalMsg(error);
        setModalAction(null);
        setShowModal(true);
      } else {
        setModalTitle("Conta criada!");
        setModalMsg("Um e-mail de confirmação foi enviado. Verifique sua caixa de entrada.");
        setModalAction(() => () => router.back());
        setShowModal(true);
      }
    } catch {
      setModalTitle("Erro");
      setModalMsg("Ocorreu um erro ao criar a conta. Tente novamente.");
      setModalAction(null);
      setShowModal(true);
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
              Criar sua conta
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 mb-8">
              Crie sua conta para acessar o MindEase
            </Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome"
                  placeholder="Digite seu nome"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                />
              )}
            />

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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirmar senha"
                  placeholder="Confirme sua senha"
                  secureTextEntry
                  showPasswordToggle
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <View className="mt-2">
              <Button
                title="Criar conta"
                variant="primary"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>

            <View className="flex-row items-center justify-center mt-6 gap-1">
              <Text className="text-gray-500 dark:text-gray-400">Já tem uma conta?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary font-semibold">Entrar agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={showModal}
        title={modalTitle}
        message={modalMsg}
        confirmLabel="OK"
        infoOnly
        onConfirm={() => {
          setShowModal(false);
          if (modalAction) modalAction();
        }}
        onCancel={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}
