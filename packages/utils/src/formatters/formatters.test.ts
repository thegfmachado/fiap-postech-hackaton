import { describe, test, expect } from 'vitest';
import { formatDate, formatCurrency } from './formatters.js';

describe('formatters', () => {
  test('should format date with short style by default', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date);

    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  test('should format date with medium style', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date, 'medium');

    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  test('should format date with long style', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date, 'long');

    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  test('should return PT-BR format for date', () => {
    const date = new Date('2024-12-25');
    const formatted = formatDate(date, 'long');

    expect(formatted.toLowerCase()).toMatch(/dez|dezembro/);
  });

  test('should format currency value in BRL', () => {
    const formatted = formatCurrency(1000);

    expect(formatted).toContain('R$');
    expect(formatted).toContain('1.000');
  });

  test('should format cents correctly', () => {
    const formatted = formatCurrency(10.50);

    expect(formatted).toContain('R$');
    expect(formatted).toContain('10,50');
  });

  test('should format negative currency values', () => {
    const formatted = formatCurrency(-50);

    expect(formatted).toContain('R$');
    expect(formatted.includes('-') || formatted.includes('(')).toBe(true);
  });

  test('should format zero currency correctly', () => {
    const formatted = formatCurrency(0);

    expect(formatted).toContain('R$');
    expect(formatted).toContain('0,00');
  });

  test('should accept custom currency options', () => {
    const formatted = formatCurrency(1234.56, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });

    expect(formatted).toContain('R$');
    expect(formatted).toContain('1.234,560');
  });

  test('should format large currency values', () => {
    const formatted = formatCurrency(1000000);

    expect(formatted).toContain('R$');
    expect(formatted).toContain('1.000.000');
  });
});
