import path from 'node:path';
import { createReactConfig } from '@mindease/vitest-preset/react';

const dirname = __dirname;

export default createReactConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, './'),
    },
  },
});
