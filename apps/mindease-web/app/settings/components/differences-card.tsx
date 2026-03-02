import { Card, CardContent, CardHeader, CardTitle } from "@mindease/design-system/components";

export function DifferencesCard() {
  return (
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
  )
}