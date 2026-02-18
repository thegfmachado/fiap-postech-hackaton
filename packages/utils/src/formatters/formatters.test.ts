import { describe, test, expect } from 'vitest';
import { formatDate, formatCurrency } from './formatters.js';

describe('formatters', () => {
  test('should format date with short style by default', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const formatted = formatDate(date);

    // PT-BR short format: DD/MM/YYYY
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatted).toContain('/01/2024');
  });

  test('should format date with medium style', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const formatted = formatDate(date, 'medium');

    // PT-BR medium format: DD de MMM. de YYYY
    expect(formatted).toMatch(/\d{1,2} de \w{3,4}\.? de \d{4}/);
    expect(formatted.toLowerCase()).toContain('jan');
    expect(formatted).toContain('2024');
  });

  test('should format date with long style', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const formatted = formatDate(date, 'long');

    // PT-BR long format: DD de MMMM de YYYY
    expect(formatted).toMatch(/\d{1,2} de \w+ de \d{4}/);
    expect(formatted.toLowerCase()).toContain('janeiro');
    expect(formatted).toContain('2024');
  });

  test('should return PT-BR format for date', () => {
    const date = new Date('2024-12-25T12:00:00Z');
    const formatted = formatDate(date, 'long');

    expect(formatted.toLowerCase()).toContain('dezembro');
    expect(formatted).toContain('25');
    expect(formatted).toContain('2024');
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
