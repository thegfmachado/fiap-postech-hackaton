import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import type { ViteUserConfig } from 'vitest/config';

/**
 * React-specific Vitest configuration for MindEase monorepo
 * This includes jsdom environment and React Testing Library setup
 */
export const createReactConfig = (overrides?: ViteUserConfig): ViteUserConfig => {
  return defineConfig({
    plugins: [react() as any],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['@mindease/vitest-preset/setup-react'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'dist/',
          '.next/',
          '**/*.config.*',
          '**/*.d.ts',
          '**/types.ts',
          '**/__tests__/**',
          '**/*.test.*',
          '**/*.spec.*',
          '**/app/**/layout.tsx',
          '**/app/**/page.tsx',
        ],
      },
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist', '.next', 'build'],
      ...overrides?.test,
    },
    ...overrides,
  });
};

export default createReactConfig();
