"use client";

import { Kanban } from "lucide-react";
import {
  Card,
  CardContent,
} from "@mindease/design-system/components";

export type WelcomeHeroProps = {
  cards: {
    title: string;
    icon: React.ReactNode;
  }[];
};

export function WelcomeHero(props: WelcomeHeroProps) {
  const { cards } = props;

  return (
    <section className="p-5 md:p-10 border-r border-gray-100 grow flex flex-col items-center justify-center bg-linear-to-b from-brand-100/30 via-brand-100/20 to-white">
      <div className="p-5 space-y-5 md:p-10 md:space-y-10 flex flex-col items-center justify-center h-full max-w-xl">
        <div className="hidden md:flex items-center gap-3">
          <Kanban className="w-14 h-14 text-primary" />
          <span className="text-6xl font-bold text-primary">MindEase</span>
        </div>

        <h1 className="text-4xl md:text-3xl lg:text-4xl text-center font-bold max-w-6xl">
          Bem-vindo de volta!
        </h1>

        <h2 className="text-muted-foreground md:text-lg lg:text-xl text-center max-w-6xl">
          Continue organizando suas tarefas e mantendo o foco.
          Suas informações estão seguras e prontas para você.
        </h2>
      </div>

      <div className="hidden md:flex flex-col gap-6 max-w-3xl">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex items-center justify-center p-4 bg-primary rounded">
                {card.icon}
              </div>
              <p className="text-center font-medium">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
