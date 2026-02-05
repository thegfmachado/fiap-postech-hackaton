"use client";

import { AuthService } from "@mindease-web-auth/client/services/auth-service";
import { Header } from "@mindease-web-auth/components/template/header";
import { WelcomeHero } from "@mindease-web-auth/components/welcome-hero";
import { zodResolver } from "@hookform/resolvers/zod";
import { Kanban, Timer, Loader2, Brain, Sparkles } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { createClient } from "@mindease/database/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Button,
  FormLabel,
  Skeleton,
  toast,
} from "@mindease/design-system/components";
import { HTTPService } from "@mindease/services";
import { resetPasswordSchema } from "@mindease/validation-schemas";
import type { ResetPasswordSchema } from "@mindease/validation-schemas";

const httpService = new HTTPService();
const authService = new AuthService(httpService);

const cards = [
  {
    title: "Quadro Kanban",
    icon: <Kanban color="white" size={20} />
  },
  {
    title: "Timer Pomodoro",
    icon: <Timer color="white" size={20} />
  },
  {
    title: "Foco e Organização",
    icon: <Brain color="white" size={20} />
  },
  {
    title: "Interface Acessível",
    icon: <Sparkles color="white" size={20} />
  },
]

type ResetPasswordFormSchemaType = ResetPasswordSchema;

export default function Page() {
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [isFormLoading, setIsFormLoading] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setIsAuthLoading(false);
      }
    })
  }, [])

  const form = useForm<ResetPasswordFormSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: ResetPasswordFormSchemaType) => {
    setIsFormLoading(true);

    try {
      await authService.updateUserPassword(values.password);

      form.reset();

      toast.success(`Senha atualizada com sucesso! Você será redirecionado para a página de login em 3 segundos.`, {
        duration: 3000,
        onAutoClose: () => {
          // next/navigation does not support redirects to external domains
          window.location.href = "/auth/login";
        }
      });
    } catch (error) {
      console.error("Erro ao atualizar senha do usuário.", error);
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Header />

      <main className="flex flex-col md:flex-row">
        <WelcomeHero cards={cards} />

        <section className="p-5 md:p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          <Card className="w-full max-w-lg border-gray-50">
            <CardHeader>
              <CardTitle>Redefinir Senha</CardTitle>
              <CardDescription>
                Defina sua nova senha de acesso ao MindEase
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {
                isAuthLoading ? (
                  <div className="flex items-center justify-center w-full h-20 gap-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Autenticando seu usuário</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {
                      isFormLoading ? (
                        <div className="p-5 w-full max-w-lg grid gap-2">
                          <Skeleton className="h-9 w-full rounded-md mb-2" />
                          <Skeleton className="h-9 w-full rounded-md mb-2" />
                          <Skeleton className="h-9 w-full rounded-md mb-2" />
                          <Skeleton className="h-9 w-full rounded-md mb-2" />
                          <Skeleton className="w-full h-12 rounded-md mt-4" />
                        </div>
                      ) : (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Senha</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="password"
                                      placeholder="Digite sua senha"
                                      showPasswordToggle
                                    />

                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirmação de senha</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="password"
                                      placeholder="Confirme sua senha"
                                      showPasswordToggle
                                    />

                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button className="w-full" size="lg" type="submit">
                              Enviar
                            </Button>

                            <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2 p-4">
                              <p className="text-center text-muted-foreground">
                                Lembrou a senha?
                              </p>
                              <a className="text-primary font-medium" href="/auth/login">Voltar para login</a>
                            </div>
                          </form>
                        </Form>
                      )
                    }
                  </div>
                )
              }
            </CardContent>
          </Card>
        </section>
      </main>
    </div >
  )
}
