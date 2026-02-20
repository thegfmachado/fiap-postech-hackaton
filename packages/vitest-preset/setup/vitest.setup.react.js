import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * React-specific Vitest setup
 * Includes Testing Library utilities and cleanup
 */

afterEach(() => {
  cleanup();
});

if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn) => setTimeout(fn, 0);
}
