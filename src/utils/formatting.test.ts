import {describe, it, expect} from 'vitest';
import {
  formatFullName,
  formatDate,
  formatRelativeTime,
  truncateText,
} from './formatting';

describe('formatting utilities', () => {
  describe('formatFullName', () => {
    it('should format full name from first and last name', () => {
      expect(formatFullName('John', 'Doe')).toBe('John Doe');
      expect(formatFullName('Jane', 'Smith')).toBe('Jane Smith');
    });

    it('should handle names with extra whitespace', () => {
      expect(formatFullName('  John  ', '  Doe  ')).toBe('John Doe');
      expect(formatFullName('Jane', '  Smith  ')).toBe('Jane Smith');
    });

    it('should handle missing surname', () => {
      expect(formatFullName('John', null)).toBe('John');
      expect(formatFullName('John', undefined)).toBe('John');
      expect(formatFullName('John', '')).toBe('John');
    });

    it('should handle missing first name', () => {
      expect(formatFullName(null, 'Doe')).toBe('Doe');
      expect(formatFullName(undefined, 'Doe')).toBe('Doe');
      expect(formatFullName('', 'Doe')).toBe('Doe');
    });

    it('should return "Unknown User" when both names are missing', () => {
      expect(formatFullName(null, null)).toBe('Unknown User');
      expect(formatFullName(undefined, undefined)).toBe('Unknown User');
      expect(formatFullName('', '')).toBe('Unknown User');
      expect(formatFullName('   ', '   ')).toBe('Unknown User');
    });
  });

  describe('formatDate', () => {
    it('should format a Date object', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should format an ISO date string', () => {
      const formatted = formatDate('2024-01-15T10:30:00Z');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should format a timestamp', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const formatted = formatDate(timestamp);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
      expect(formatDate(NaN)).toBe('Invalid Date');
    });

    it('should use custom locale', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, 'uk-UA');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for very recent dates', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
      expect(formatRelativeTime(recent)).toBe('just now');
    });

    it('should format minutes ago', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toContain('minute');
      expect(result).toContain('ago');
    });

    it('should format hours ago', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo);
      expect(result).toContain('hour');
      expect(result).toContain('ago');
    });

    it('should format days ago', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeDaysAgo);
      expect(result).toContain('day');
      expect(result).toContain('ago');
    });

    it('should handle future dates', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes in future
      const result = formatRelativeTime(future);
      expect(result).toContain('in');
    });

    it('should handle invalid dates', () => {
      expect(formatRelativeTime('invalid-date')).toBe('Invalid Date');
      expect(formatRelativeTime(NaN)).toBe('Invalid Date');
    });

    it('should use singular form for 1 minute/hour/day', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
      const result = formatRelativeTime(oneMinuteAgo);
      expect(result).toBe('1 minute ago');
    });
  });

  describe('truncateText', () => {
    it('should return original text if shorter than maxLength', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should truncate text longer than maxLength', () => {
      const longText = 'This is a very long text that needs to be truncated';
      const result = truncateText(longText, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 chars + '...' (3 chars)
    });

    it('should handle empty strings', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('should handle text exactly at maxLength', () => {
      const text = 'Exactly ten!';
      // "Exactly ten!" is 12 characters, so maxLength 12 should not truncate
      expect(truncateText(text, 12)).toBe('Exactly ten!');
      // maxLength 11 should truncate
      expect(truncateText(text, 11)).toBe('Exactly ten...');
    });

    it('should handle very short maxLength', () => {
      const text = 'Hello World';
      const result = truncateText(text, 5);
      expect(result).toBe('Hello...');
    });
  });
});

