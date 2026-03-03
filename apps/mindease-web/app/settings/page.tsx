"use client";

import { Settings, Eye, EyeOff, Timer, Clock, Contrast, Type, Rows3, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { Header } from "@/components/template/header";
import { Layout } from "@/components/template/layout";
import { Main } from "@/components/template/main";
import { Sidebar } from "@/components/template/sidebar";
import { useDisplayMode } from "@/hooks/use-display-mode";
import { useUserSettingsContext } from "@/contexts/user-settings-context";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
} from "@mindease/design-system/components";
import { ContrastMode, Size, ViewMode } from "@mindease/models";

export default function ConfiguracoesPage() {
  const { displayMode, setDisplayMode, isSimplified, isDetailed } = useDisplayMode();
  const { userSettings, updateSettings, loading } = useUserSettingsContext();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <Layout>
      <Header />
      <Sidebar />
      <Main>
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
                    value={userSettings.pomodoroDurationMinutes.toString()}
                    onChange={(e) =>
                      updateSettings({
                        ...userSettings,
                        pomodoroDurationMinutes: parseInt(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {[15, 20, 25, 30, 45, 60].map((min) => (
                      <option key={min} value={min.toString()}>
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
                    value={userSettings.shortBreakDurationMinutes.toString()}
                    onChange={(e) =>
                      updateSettings({
                        ...userSettings,
                        shortBreakDurationMinutes: parseInt(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {[3, 5, 10, 15].map((min) => (
                      <option key={min} value={min.toString()}>
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
                    value={userSettings.longBreakDurationMinutes.toString()}
                    onChange={(e) =>
                      updateSettings({
                        ...userSettings,
                        longBreakDurationMinutes: parseInt(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {[15, 20, 25, 30].map((min) => (
                      <option key={min} value={min.toString()}>
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
              {/* Tema claro/escuro */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Sun className="h-4 w-4" />
                  Tema
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "light", label: "Claro", description: "Interface com fundo branco", icon: Sun },
                    { value: "dark", label: "Escuro", description: "Interface com fundo escuro, menos cansativo para os olhos", icon: Moon },
                  ].map(({ value, label, description, icon: Icon }) => {
                    const isActive = mounted && theme === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={`relative p-4 rounded-lg border-2 transition-all text-left ${isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-white" : "bg-muted"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-0.5">{label}</h3>
                            <p className="text-xs text-muted-foreground">{description}</p>
                          </div>
                        </div>
                        {isActive && (
                          <div className="absolute top-3 right-3 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Modo Detalhado */}
                <button
                  onClick={() => setDisplayMode(ViewMode.detailed)}
                  className={`relative p-6 rounded-lg border-2 transition-all text-left ${isDetailed
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isDetailed ? "bg-primary text-white" : "bg-muted"}`}>
                      <Eye className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Modo Detalhado</h3>
                      <p className="text-sm text-muted-foreground">
                        Mostra todas as informações disponíveis, incluindo descrições, botões de ação, contadores de pomodoro e o widget flutuante.
                      </p>
                    </div>
                  </div>
                  {isDetailed && (
                    <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>

                {/* Modo Simplificado */}
                <button
                  onClick={() => setDisplayMode(ViewMode.summary)}
                  className={`relative p-6 rounded-lg border-2 transition-all text-left ${isSimplified
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSimplified ? "bg-primary text-white" : "bg-muted"}`}>
                      <EyeOff className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Modo Simplificado</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduz elementos visuais para evitar distrações. Oculta o widget de pomodoro, descrições e botões secundários dos cards.
                      </p>
                    </div>
                  </div>
                  {isSimplified && (
                    <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Contrast className="h-5 w-5" />
                Acessibilidade
              </CardTitle>
              <CardDescription>
                Ajuste contraste, tamanho da fonte e espaçamento para melhor legibilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contraste */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Contrast className="h-4 w-4" />
                  Contraste
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: ContrastMode.low, label: "Baixo Contraste", description: "Aparência padrão com suavidade visual" },
                    { value: ContrastMode.high, label: "Alto Contraste", description: "Bordas e textos mais fortes para maior legibilidade" },
                  ].map(({ value, label, description }) => {
                    const isActive = userSettings.contrastMode === value;
                    return (
                      <button
                        key={value}
                        onClick={() => updateSettings({ ...userSettings, contrastMode: value })}
                        className={`relative p-4 rounded-lg border-2 transition-all text-left ${isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-white" : "bg-muted"}`}>
                            <Contrast className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-0.5">{label}</h3>
                            <p className="text-xs text-muted-foreground">{description}</p>
                          </div>
                        </div>
                        {isActive && (
                          <div className="absolute top-3 right-3 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tamanho da Fonte */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4" />
                  Tamanho da Fonte
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: Size.small, label: "Pequeno" },
                    { value: Size.medium, label: "Médio" },
                    { value: Size.large, label: "Grande" },
                  ].map(({ value, label }) => {
                    const isActive = userSettings.fontSize === value;
                    return (
                      <button
                        key={value}
                        onClick={() => updateSettings({ ...userSettings, fontSize: value })}
                        className={`relative p-4 rounded-lg border-2 transition-all text-center ${isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                      >
                        <div className={`p-2 rounded-lg mx-auto w-fit mb-2 ${isActive ? "bg-primary text-white" : "bg-muted"}`}>
                          <Type className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm">{label}</span>
                        {isActive && (
                          <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Espaçamento */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Rows3 className="h-4 w-4" />
                  Espaçamento
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: Size.small, label: "Compacto" },
                    { value: Size.medium, label: "Padrão" },
                    { value: Size.large, label: "Espaçoso" },
                  ].map(({ value, label }) => {
                    const isActive = userSettings.spacing === value;
                    return (
                      <button
                        key={value}
                        onClick={() => updateSettings({ ...userSettings, spacing: value })}
                        className={`relative p-4 rounded-lg border-2 transition-all text-center ${isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                      >
                        <div className={`p-2 rounded-lg mx-auto w-fit mb-2 ${isActive ? "bg-primary text-white" : "bg-muted"}`}>
                          <Rows3 className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm">{label}</span>
                        {isActive && (
                          <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo das Diferenças</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Elemento</th>
                      <th className="text-center py-2 font-semibold">Detalhado</th>
                      <th className="text-center py-2 font-semibold">Simplificado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3">Widget de Pomodoro</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3">Descrição dos cards</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3">Botões de editar/deletar</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3">Contador de pomodoros</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3">Ícone de arrastar (grip)</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3">Título e prioridade</td>
                      <td className="text-center py-3">✅</td>
                      <td className="text-center py-3">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </Layout>
  );
}
