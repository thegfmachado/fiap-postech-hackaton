"use client";

import { AuthService } from "@mindease-web-auth/client/services/auth-service";
import { WelcomeHero } from "@mindease-web-auth/components/welcome-hero";
import { zodResolver } from "@hookform/resolvers/zod";
import { Kanban, Timer, Brain, Sparkles } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

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
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@mindease/validation-schemas";

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

type ForgotPasswordFormSchemaType = ForgotPasswordSchema;

export default function Page() {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ForgotPasswordFormSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormSchemaType) => {
    setIsLoading(true);

    await authService.forgotPassword(values.email);

    setIsLoading(false);

    toast.success(`Caso uma conta exista para este endereço de e-mail, você receberá instruções para continuar. Verifique sua caixa de entrada (e de spam também).`, {
      duration: 6000,
    });
  }

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <main className="flex flex-col md:flex-row">
        <WelcomeHero cards={cards} />

        <section className="p-5 md:p-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          <Card className="w-full max-w-lg border-gray-50">
            <CardHeader>
              <CardTitle>Solicitação de Redefinir Senha</CardTitle>
              <CardDescription>
                Digite seu email para prosseguir com a redefinição da senha de acesso ao MindEase
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {
                isLoading ? (
                  <div className="p-5 w-full max-w-lg grid gap-2">
                    <Skeleton className="h-9 w-full rounded-md mb-2" />
                    <Skeleton className="w-full h-12 rounded-md mt-4" />
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="seu@email.com"
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
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
