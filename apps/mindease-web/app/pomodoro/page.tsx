"use client";

import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

import { Header } from "@/components/template/header";
import { Layout } from "@/components/template/layout";
import { Main } from "@/components/template/main";
import { Sidebar } from "@/components/template/sidebar";
import { usePomodoroTimer } from "@/hooks/use-pomodoro-timer";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@mindease/design-system/components";

export default function PomodoroPage() {
  const {
    mode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    settings,
    progress,
    toggleTimer,
    resetTimer,
    changeMode,
    formatTime,
  } = usePomodoroTimer();

  const modeConfig = {
    work: {
      label: "Foco",
      icon: Brain,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    break: {
      label: "Pausa Curta",
      icon: Coffee,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    longBreak: {
      label: "Pausa Longa",
      icon: Coffee,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  };

  const currentConfig = modeConfig[mode];
  const Icon = currentConfig.icon;

  return (
    <Layout>
      <Header />
      <Sidebar />
      <Main>
        <div className="flex flex-col w-full p-4 md:p-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold">Timer Pomodoro</h1>
            <p className="text-muted-foreground mt-1">
              Mantenha o foco com intervalos estruturados
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {(["work", "break", "longBreak"] as const).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? "default" : "outline"}
                  onClick={() => changeMode(m)}
                  disabled={isRunning}
                >
                  {modeConfig[m].label}
                </Button>
              ))}
            </div>

            <Card className={`w-full max-w-2xl ${currentConfig.bgColor} border-2`}>
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center gap-6">
                  <div className={`${currentConfig.color} flex items-center gap-2`}>
                    <Icon className="h-8 w-8" />
                    <span className="text-lg font-semibold">
                      {currentConfig.label}
                    </span>
                  </div>

                  <div className="relative w-full max-w-md aspect-square">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted opacity-20"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className={currentConfig.color}
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl md:text-8xl font-bold">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      onClick={toggleTimer}
                      className="min-w-32"
                    >
                      {isRunning ? (
                        <>
                          <Pause className="h-5 w-5 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Iniciar
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetTimer}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-center">Sessões Completadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-2 flex-wrap">
                  {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold ${
                        i < sessionsCompleted % settings.sessionsBeforeLongBreak
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  Total: {sessionsCompleted} pomodoros completados
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </Layout>
  );
}
