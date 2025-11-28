import {describe, it, expect} from 'vitest';
import {cn} from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    expect(cn('foo', true && 'bar')).toBe('foo bar');
  });

  it('should merge Tailwind classes and resolve conflicts', () => {
    // tailwind-merge should resolve conflicting classes
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4'); // px-4 should override px-2
    expect(result).toContain('py-1');
  });

  it('should handle empty strings and null values', () => {
    expect(cn('foo', '', null, 'bar')).toBe('foo bar');
    expect(cn(null, undefined, 'baz')).toBe('baz');
  });

  it('should handle arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('should handle objects with boolean values', () => {
    expect(cn({foo: true, bar: false, baz: true})).toBe('foo baz');
  });

  it('should return empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('should handle mixed input types', () => {
    const result = cn(
      'base-class',
      ['array-class-1', 'array-class-2'],
      {conditional: true, hidden: false},
      'string-class',
    );
    expect(result).toContain('base-class');
    expect(result).toContain('array-class-1');
    expect(result).toContain('array-class-2');
    expect(result).toContain('conditional');
    expect(result).toContain('string-class');
    expect(result).not.toContain('hidden');
  });
});

