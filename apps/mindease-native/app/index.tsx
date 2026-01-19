import { ScrollView } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { GradientLogo } from '@/components/ui/GradientLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Index() {
  return (
    <ScrollView className="flex-1">
      <ThemedView className="flex-1">
        <GradientLogo />
        
        <ThemedView className="p-6">
          <ThemedText type="title" className="mb-2">
            Bem-vindo ao MindEase
          </ThemedText>
          
          <ThemedText type="subtitle" className="mb-6 text-gray-600">
            Sua jornada de bem-estar mental começa aqui
          </ThemedText>

          <Input
            label="Email"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
            showPasswordToggle
          />

          <Button
            title="Entrar"
            variant="primary"
            className="mb-3"
          />

          <Button
            title="Criar conta"
            variant="secondary"
          />

          <Button
            title="Explorar como visitante"
            variant="ghost"
            className="mt-2"
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
