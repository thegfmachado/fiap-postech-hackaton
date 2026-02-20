"use client";

import { Settings, Eye, EyeOff, Timer, Clock } from "lucide-react";
import { useState, useEffect } from "react";

import { Header } from "@/components/template/header";
import { Layout } from "@/components/template/layout";
import { Main } from "@/components/template/main";
import { Sidebar } from "@/components/template/sidebar";
import { useDisplayMode } from "@/hooks/use-display-mode";
import { useCurrentUser } from "@/hooks/use-current-user";
import { defaultPomodoroSettings, type PomodoroSettings } from "@/hooks/use-pomodoro-timer";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label } from "@mindease/design-system/components";
import { SettingsClientService } from "@/client/services/settings-service";
import { HTTPService } from "@mindease/services";

export default function ConfiguracoesPage() {
  const { displayMode, setDisplayMode, isSimplified, isDetailed } = useDisplayMode();
  const { user } = useCurrentUser();
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(defaultPomodoroSettings);

  const settingsService = new SettingsClientService(new HTTPService());

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;

      try {
        const settings = await settingsService.getById(user.id);

        if (settings) {
          setPomodoroSettings({
            work: settings.pomodoroDurationMinutes,
            break: settings.shortBreakDurationMinutes,
            longBreak: settings.longBreakDurationMinutes,
            sessionsBeforeLongBreak: settings.longBreakAfterPomodoros,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    fetchSettings();
  }, [user?.id]);

  const handlePomodoroSettingsChange = async (newSettings: PomodoroSettings) => {
    setPomodoroSettings(newSettings);

    if (typeof window !== "undefined") {
      localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings));
    }

    if (user?.id) {
      try {
        await settingsService.update(user.id, {
          pomodoroDurationMinutes: newSettings.work,
          shortBreakDurationMinutes: newSettings.break,
          longBreakDurationMinutes: newSettings.longBreak,
          longBreakAfterPomodoros: newSettings.sessionsBeforeLongBreak,
        } as any);
      } catch (error) {
        console.error("Erro ao atualizar configurações:", error);
      }
    }
  };

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
                    value={pomodoroSettings.work.toString()}
                    onChange={(e) =>
                      handlePomodoroSettingsChange({
                        ...pomodoroSettings,
                        work: parseInt(e.target.value),
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
                    value={pomodoroSettings.break.toString()}
                    onChange={(e) =>
                      handlePomodoroSettingsChange({
                        ...pomodoroSettings,
                        break: parseInt(e.target.value),
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
                    value={pomodoroSettings.longBreak.toString()}
                    onChange={(e) =>
                      handlePomodoroSettingsChange({
                        ...pomodoroSettings,
                        longBreak: parseInt(e.target.value),
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Modo Detalhado */}
                <button
                  onClick={() => setDisplayMode("detailed")}
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
                  onClick={() => setDisplayMode("simplified")}
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
