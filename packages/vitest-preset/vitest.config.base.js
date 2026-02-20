import { defineConfig } from 'vitest/config';

/**
 * Base Vitest configuration for MindEase monorepo
 * This provides common settings for all packages/apps
 */
export const createBaseConfig = (overrides) => {
  return defineConfig({
    test: {
      globals: true,
      environment: 'node',
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
        ],
      },
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist', '.next', 'build'],
      ...overrides?.test,
    },
    ...overrides,
  });
};

export default createBaseConfig();
