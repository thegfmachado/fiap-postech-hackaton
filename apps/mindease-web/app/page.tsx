"use client";

import Link from "next/link";
import { Kanban, Timer, Brain, Sparkles } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@mindease/design-system/components";

const cards = [
  {
    title: "Quadro Kanban Visual",
    content: "Organize suas tarefas de forma visual e intuitiva, adaptado para diferentes estilos de aprendizado.",
    icon: Kanban,
  },
  {
    title: "Timer Pomodoro Flexível",
    content: "Mantenha o foco com intervalos personalizados que respeitam seu ritmo de trabalho.",
    icon: Timer,
  },
  {
    title: "Acessibilidade em Foco",
    content: "Interface adaptada para pessoas neurodivergentes com opções de complexidade variável.",
    icon: Brain,
  },
  {
    title: "Ambiente Livre de Distrações",
    content: "Design minimalista e funcional que ajuda você a manter a concentração.",
    icon: Sparkles,
  },
]

export default function Page() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <header className="p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <Kanban className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">MindEase</span>
            </Link>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                    Sobre
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                    Serviços
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                    Valores
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                    Contato
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">
              <a href="/auth/signup">Criar minha conta</a>
            </Button>
            <Button asChild>
              <a href="/auth/login">Entrar</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="mt-12">
        <section className="relative flex flex-col py-20 gap-10 md:gap-20 items-center justify-center bg-linear-to-b from-white via-white to-neutral-900/20">
          <h1 className="text-4xl md:text-7xl lg:text-8xl text-center font-bold max-w-6xl">
            Produtividade Acessível para Todos
          </h1>

          <h2 className="text-lg md:text-center text-center px-4 max-w-3xl">
            Gerencie suas tarefas com quadro Kanban e mantenha o foco com Pomodoro. 
            Uma ferramenta pensada especialmente para pessoas neurodivergentes.
          </h2>

          <Button asChild>
            <a href="/auth/login">Comece agora</a>
          </Button>

          <div className="mt-12 flex justify-center">
            <Kanban className="w-32 h-32 md:w-48 md:h-48 text-primary/20" />
          </div>
        </section>

        <section className="p-8 flex flex-col gap-12">
          <h2 className="text-3xl text-center font-bold">Por que escolher o MindEase?</h2>

          <div className="grid grid-cols-1 md:grid-cols-[repeat(2,minmax(0,664px))] gap-6 justify-center">
            {cards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Card key={index} className="w-full">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p>{card.content}</p>
                    <div className="self-center">
                      <IconComponent className="w-24 h-24 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="p-4 border-t border-t-secondary">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Kanban className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">MindEase</span>
          </Link>

          <NavigationMenu className="flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Sobre
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Serviços
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Valores
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Contato
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </footer>
    </div>
  )
}
