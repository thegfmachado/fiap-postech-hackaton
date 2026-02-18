import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * React-specific Vitest configuration for MindEase monorepo
 * This includes jsdom environment and React Testing Library setup
 */
export const createReactConfig = (overrides) => {
  const baseSetupFiles = ['@mindease/vitest-preset/setup-react'];
  const overrideSetupFiles = overrides?.test?.setupFiles || [];
  const setupFiles = [
    ...baseSetupFiles,
    ...(Array.isArray(overrideSetupFiles) ? overrideSetupFiles : [overrideSetupFiles]),
  ];

  const { setupFiles: _, ...testOverrides } = overrides?.test || {};

  return defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles,
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
      ...testOverrides,
    },
    ...overrides,
  });
};

export default createReactConfig();
