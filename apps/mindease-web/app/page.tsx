"use client";

import { Button } from "@mindease/design-system/components";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@mindease/design-system/components";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl text-primary">
            Bem-vindo ao MindEase
          </CardTitle>
          <CardDescription className="text-lg">
            Sua plataforma inclusiva de saúde mental
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Acesse suporte, recursos e ferramentas de saúde mental projetados com acessibilidade em mente.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <a href="/auth/login">Começar</a>
            </Button>
            <Button variant="outline" size="lg">Saiba Mais</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
