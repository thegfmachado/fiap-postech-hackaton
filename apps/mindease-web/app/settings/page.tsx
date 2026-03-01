"use client";

import { Settings, Eye, EyeOff, Timer, Clock } from "lucide-react";

import { Header } from "@/components/template/header";
import { Layout } from "@/components/template/layout";
import { Main } from "@/components/template/main";
import { Sidebar } from "@/components/template/sidebar";
import { useDisplayMode } from "@/hooks/use-display-mode";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserSettings } from "@/hooks/use-user-settings";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
} from "@mindease/design-system/components";
import { ViewMode } from "@mindease/models";
import { DifferencesCard } from "./components/differences-card";
import { SelectModeButton } from "./components/select-mode-button";

export default function ConfiguracoesPage() {
  const { setDisplayMode, isSimplified, isDetailed } = useDisplayMode();
  const { user } = useCurrentUser();
  const { userSettings, updateSettings, loading } = useUserSettings(user?.id);

  return (
    <Layout>
      <Header />
      <Sidebar />
      <Main>
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        )}

        {!loading && (
          <div className="flex flex-col w-full p-4 md:p-8 gap-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="h-8 w-8" />
                Configurações
              </h1>
              <p className="text-muted-foreground mt-1">
                Personalize sua experiência de acordo com suas necessidades
              </p>
            </div>

            {/* Configurações do Pomodoro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Timer Pomodoro
                </CardTitle>
                <CardDescription>
                  Personalize os intervalos de tempo do seu Pomodoro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Tempo de Foco
                    </Label>
                    <select
                      id="work-time"
                      value={userSettings.pomodoroDurationMinutes}
                      onChange={(e) =>
                        updateSettings({
                          ...userSettings,
                          pomodoroDurationMinutes: Number(e.target.value),
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {[15, 20, 25, 30, 45, 60].map((min) => (
                        <option key={min} value={min}>
                          {min} minutos
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="break-time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pausa Curta
                    </Label>
                    <select
                      id="break-time"
                      value={userSettings.shortBreakDurationMinutes}
                      onChange={(e) =>
                        updateSettings({
                          ...userSettings,
                          shortBreakDurationMinutes: Number(e.target.value),
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {[3, 5, 10, 15].map((min) => (
                        <option key={min} value={min}>
                          {min} minutos
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="long-break-time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pausa Longa
                    </Label>
                    <select
                      id="long-break-time"
                      value={userSettings.longBreakDurationMinutes}
                      onChange={(e) =>
                        updateSettings({
                          ...userSettings,
                          longBreakDurationMinutes: Number(e.target.value),
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {[15, 20, 25, 30].map((min) => (
                        <option key={min} value={min}>
                          {min} minutos
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Dica:</strong> A técnica Pomodoro tradicional usa 25 minutos de foco,
                    5 minutos de pausa curta e 15 minutos de pausa longa. Ajuste conforme sua preferência.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modo de Exibição</CardTitle>
                <CardDescription>
                  Escolha como as informações são apresentadas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Modo Detalhado */}
                  <SelectModeButton
                    icon={<Eye className="h-5 w-5" />}
                    title="Modo Detalhado"
                    description="Mostra todas as informações disponíveis, incluindo descrições, botões de ação, contadores de pomodoro e o widget flutuante."
                    selected={isDetailed}
                    onClick={() => setDisplayMode(ViewMode.detailed)}
                  />

                  {/* Modo Simplificado */}
                  <SelectModeButton 
                    icon={<EyeOff className="h-5 w-5" />}
                    title="Modo Simplificado"
                    description="Reduz elementos visuais para evitar distrações. Oculta o widget de pomodoro, descrições e botões secundários dos cards."
                    selected={isSimplified}
                    onClick={() => setDisplayMode(ViewMode.summary)}
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">ℹ️</span>
                    Sobre Acessibilidade
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    O modo simplificado foi projetado especialmente para pessoas neurodivergentes,
                    reduzindo estímulos visuais e mantendo apenas as informações essenciais para
                    o foco nas tarefas. Você pode alternar entre os modos a qualquer momento.
                  </p>
                </div>
              </CardContent>
            </Card>

            <DifferencesCard />
          </div>
        )}
      </Main>
    </Layout>
  );
}
