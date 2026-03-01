"use client";

import { Play, Pause, RotateCcw, Timer as TimerIcon, X, Coffee, Brain } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { useDisplayMode } from "@/hooks/use-display-mode";
import { Button, Card, CardContent } from "@mindease/design-system/components";
import { usePomodoroTimer } from "@/hooks/use-pomodoro-timer/use-pomodoro-timer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserSettings } from "@/hooks/use-user-settings";

export function PomodoroWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { isSimplified } = useDisplayMode();

  const { user } = useCurrentUser();
  const { userSettings } = useUserSettings(user?.id);

  const {
    mode,
    timeLeft,
    isRunning,
    toggleTimer,
    resetTimer,
    formatTime,
    changeMode,
  } = usePomodoroTimer(userSettings);

  // Não mostrar o widget na página de Pomodoro ou no modo simplificado
  if (pathname === "/pomodoro" || isSimplified) {
    return null;
  }

  const modeColors = {
    work: "bg-primary hover:bg-primary/90",
    break: "bg-green-600 hover:bg-green-700",
    longBreak: "bg-blue-600 hover:bg-blue-700",
  };

  const modeTextColors = {
    work: "text-primary",
    break: "text-green-600",
    longBreak: "text-blue-600",
  };

  const modeBorderColors = {
    work: "border-primary",
    break: "border-green-600",
    longBreak: "border-blue-600",
  };

  const modeLabels = {
    work: "Foco",
    break: "Pausa",
    longBreak: "Pausa Longa",
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`fixed bottom-6 right-6 z-50 ${modeColors[mode]} text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform`}
        aria-label="Abrir Pomodoro"
      >
        <TimerIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-80 shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TimerIcon className={`h-5 w-5 ${modeTextColors[mode]}`} />
            <span className="font-semibold">{modeLabels[mode]}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === "work" ? "default" : "outline"}
            size="sm"
            onClick={() => changeMode("work")}
            className="flex-1"
          >
            <Brain className="h-3 w-3 mr-1" />
            Foco
          </Button>
          <Button
            variant={mode === "break" ? "default" : "outline"}
            size="sm"
            onClick={() => changeMode("break")}
            className={`flex-1 ${mode === "break" ? "bg-green-600 hover:bg-green-700 border-green-600" : "hover:bg-green-50 hover:border-green-600"}`}
          >
            <Coffee className="h-3 w-3 mr-1" />
            Pausa
          </Button>
          <Button
            variant={mode === "longBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => changeMode("longBreak")}
            className={`flex-1 text-xs ${mode === "longBreak" ? "bg-blue-600 hover:bg-blue-700 border-blue-600" : "hover:bg-blue-50 hover:border-blue-600"}`}
          >
            <Coffee className="h-3 w-3 mr-1" />
            Longa
          </Button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="text-5xl font-bold tabular-nums">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-2 w-full">
            <Button
              onClick={toggleTimer}
              className="flex-1"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
