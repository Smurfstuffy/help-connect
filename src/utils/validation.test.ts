import {describe, it, expect} from 'vitest';
import {
  isValidCategory,
  isValidUrgency,
  normalizeCategory,
  normalizeUrgency,
  validateParsedHelpRequest,
  isValidCity,
} from './validation';
import {ParsedHelpRequest} from '@/services/openai/help-requests/parseHelpRequest';
import {HelpRequestCategory, HelpRequestUrgency} from '@/types/app/enums';

describe('validation utilities', () => {
  describe('isValidCategory', () => {
    it('should return true for valid categories', () => {
      expect(isValidCategory('Food')).toBe(true);
      expect(isValidCategory('Transportation')).toBe(true);
      expect(isValidCategory('Medical')).toBe(true);
      expect(isValidCategory('Shelter')).toBe(true);
      expect(isValidCategory('Clothing')).toBe(true);
      expect(isValidCategory('Other')).toBe(true);
    });

    it('should return false for invalid categories', () => {
      expect(isValidCategory('Invalid')).toBe(false);
      expect(isValidCategory('')).toBe(false);
      expect(isValidCategory('food')).toBe(false); // case sensitive
      expect(isValidCategory('FOOD')).toBe(false); // case sensitive
    });
  });

  describe('isValidUrgency', () => {
    it('should return true for valid urgency levels', () => {
      expect(isValidUrgency('Low')).toBe(true);
      expect(isValidUrgency('Medium')).toBe(true);
      expect(isValidUrgency('High')).toBe(true);
      expect(isValidUrgency('Critical')).toBe(true);
    });

    it('should return false for invalid urgency levels', () => {
      expect(isValidUrgency('Invalid')).toBe(false);
      expect(isValidUrgency('')).toBe(false);
      expect(isValidUrgency('low')).toBe(false); // case sensitive
      expect(isValidUrgency('URGENT')).toBe(false);
    });
  });

  describe('normalizeCategory', () => {
    it('should return the category if valid', () => {
      expect(normalizeCategory('Food')).toBe('Food');
      expect(normalizeCategory('Medical')).toBe('Medical');
    });

    it('should return "Other" for invalid categories', () => {
      expect(normalizeCategory('Invalid')).toBe('Other');
      expect(normalizeCategory('')).toBe('Other');
      expect(normalizeCategory('unknown')).toBe('Other');
    });
  });

  describe('normalizeUrgency', () => {
    it('should return the urgency if valid', () => {
      expect(normalizeUrgency('High')).toBe('High');
      expect(normalizeUrgency('Critical')).toBe('Critical');
    });

    it('should return "Medium" for invalid urgency levels', () => {
      expect(normalizeUrgency('Invalid')).toBe('Medium');
      expect(normalizeUrgency('')).toBe('Medium');
      expect(normalizeUrgency('unknown')).toBe('Medium');
    });
  });

  describe('isValidCity', () => {
    it('should return true for valid city strings', () => {
      expect(isValidCity('Kyiv')).toBe(true);
      expect(isValidCity('Lviv')).toBe(true);
      expect(isValidCity('New York')).toBe(true);
    });

    it('should return false for invalid city values', () => {
      expect(isValidCity(null)).toBe(false);
      expect(isValidCity(undefined)).toBe(false);
      expect(isValidCity('')).toBe(false);
      expect(isValidCity('null')).toBe(false);
      expect(isValidCity('Not specified')).toBe(false);
      expect(isValidCity('   ')).toBe(false); // whitespace only
    });
  });

  describe('validateParsedHelpRequest', () => {
    it('should return true for valid parsed help requests', () => {
      const validRequest: ParsedHelpRequest = {
        city: 'Kyiv',
        category: 'Medical',
        urgency: 'High',
        description: 'Urgent medical assistance needed',
      };

      expect(validateParsedHelpRequest(validRequest)).toBe(true);
    });

    it('should return false for missing city', () => {
      const invalidRequest: Partial<ParsedHelpRequest> = {
        city: '',
        category: 'Medical' as HelpRequestCategory,
        urgency: 'High' as HelpRequestUrgency,
        description: 'Some description',
      };

      expect(validateParsedHelpRequest(invalidRequest)).toBe(false);
    });

    it('should return false for invalid city values', () => {
      const invalidRequest1: Partial<ParsedHelpRequest> = {
        city: 'null',
        category: 'Medical' as HelpRequestCategory,
        urgency: 'High' as HelpRequestUrgency,
        description: 'Some description',
      };

      const invalidRequest2: Partial<ParsedHelpRequest> = {
        city: 'Not specified',
        category: 'Medical' as HelpRequestCategory,
        urgency: 'High' as HelpRequestUrgency,
        description: 'Some description',
      };

      expect(validateParsedHelpRequest(invalidRequest1)).toBe(false);
      expect(validateParsedHelpRequest(invalidRequest2)).toBe(false);
    });

    it('should return false for invalid category', () => {
      const invalidRequest: Partial<ParsedHelpRequest> = {
        city: 'Kyiv',
        category: 'InvalidCategory' as HelpRequestCategory,
        urgency: 'High' as HelpRequestUrgency,
        description: 'Some description',
      };

      expect(validateParsedHelpRequest(invalidRequest)).toBe(false);
    });

    it('should return false for invalid urgency', () => {
      const invalidRequest: Partial<ParsedHelpRequest> = {
        city: 'Kyiv',
        category: 'Medical' as HelpRequestCategory,
        urgency: 'InvalidUrgency' as HelpRequestUrgency,
        description: 'Some description',
      };

      expect(validateParsedHelpRequest(invalidRequest)).toBe(false);
    });

    it('should return false for empty description', () => {
      const invalidRequest: Partial<ParsedHelpRequest> = {
        city: 'Kyiv',
        category: 'Medical' as HelpRequestCategory,
        urgency: 'High' as HelpRequestUrgency,
        description: '',
      };

      expect(validateParsedHelpRequest(invalidRequest)).toBe(false);
    });

    it('should return false for whitespace-only description', () => {
      const invalidRequest: Partial<ParsedHelpRequest> = {
        city: 'Kyiv',
        category: 'Medical' as HelpRequestCategory,
        urgency: 'High' as HelpRequestUrgency,
        description: '   ',
      };

      expect(validateParsedHelpRequest(invalidRequest)).toBe(false);
    });
  });
});
