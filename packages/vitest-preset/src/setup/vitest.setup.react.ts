import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * React-specific Vitest setup
 * Includes Testing Library utilities and cleanup
 */

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router if needed
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = ((fn: () => void) => setTimeout(fn, 0)) as any;
}
