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

import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@mindease/validation-schemas";
import { useAuth } from "@/contexts/auth-context";
import { GradientLogo } from "@/components/ui/GradientLogo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      const { error } = await forgotPassword(data.email);
      if (error) {
        setModalTitle("Erro");
        setModalMsg(error);
        setModalAction(null);
      } else {
        setModalTitle("Email enviado");
        setModalMsg("Caso uma conta exista para este endereço, você receberá instruções para redefinir sua senha. Verifique sua caixa de entrada.");
        setModalAction(() => () => router.back());
      }
      setShowModal(true);
    } catch {
      setModalTitle("Erro");
      setModalMsg("Ocorreu um erro inesperado. Tente novamente.");
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
              Redefinir senha
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 mb-8">
              Digite seu email para receber instruções de redefinição
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

            <View className="mt-2">
              <Button
                title="Enviar"
                variant="primary"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>

            <View className="flex-row items-center justify-center mt-6 gap-1">
              <Text className="text-gray-500 dark:text-gray-400">Lembrou a senha?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary font-semibold">
                  Voltar para login
                </Text>
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
