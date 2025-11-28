import {describe, it, expect} from 'vitest';
import {
  isValidUserRole,
  isUserRole,
  isVolunteerRole,
  canCreateHelpRequest,
  canRespondToHelpRequest,
} from './authHelpers';
import {UserRole} from '@/types/app/register';

describe('auth helper utilities', () => {
  describe('isValidUserRole', () => {
    it('should return true for valid user roles', () => {
      expect(isValidUserRole(UserRole.USER)).toBe(true);
      expect(isValidUserRole(UserRole.VOLUNTEER)).toBe(true);
    });

    it('should return false for invalid roles', () => {
      expect(isValidUserRole('admin')).toBe(false);
      expect(isValidUserRole('')).toBe(false);
      expect(isValidUserRole(null)).toBe(false);
      expect(isValidUserRole(undefined)).toBe(false);
      // Note: 'user' and 'volunteer' are valid (lowercase), but 'USER' and 'VOLUNTEER' are not
      expect(isValidUserRole('USER')).toBe(false); // uppercase not valid
      expect(isValidUserRole('VOLUNTEER')).toBe(false); // uppercase not valid
    });
  });

  describe('isUserRole', () => {
    it('should return true for user role', () => {
      expect(isUserRole(UserRole.USER)).toBe(true);
    });

    it('should return false for non-user roles', () => {
      expect(isUserRole(UserRole.VOLUNTEER)).toBe(false);
      expect(isUserRole('admin')).toBe(false);
      expect(isUserRole(null)).toBe(false);
      expect(isUserRole(undefined)).toBe(false);
    });
  });

  describe('isVolunteerRole', () => {
    it('should return true for volunteer role', () => {
      expect(isVolunteerRole(UserRole.VOLUNTEER)).toBe(true);
    });

    it('should return false for non-volunteer roles', () => {
      expect(isVolunteerRole(UserRole.USER)).toBe(false);
      expect(isVolunteerRole('admin')).toBe(false);
      expect(isVolunteerRole(null)).toBe(false);
      expect(isVolunteerRole(undefined)).toBe(false);
    });
  });

  describe('canCreateHelpRequest', () => {
    it('should return true for users (who can create help requests)', () => {
      expect(canCreateHelpRequest(UserRole.USER)).toBe(true);
    });

    it('should return false for volunteers (who cannot create requests)', () => {
      expect(canCreateHelpRequest(UserRole.VOLUNTEER)).toBe(false);
    });

    it('should return false for invalid or null roles', () => {
      expect(canCreateHelpRequest(null)).toBe(false);
      expect(canCreateHelpRequest(undefined)).toBe(false);
      expect(canCreateHelpRequest('admin')).toBe(false);
    });
  });

  describe('canRespondToHelpRequest', () => {
    it('should return true for volunteers (who can respond to requests)', () => {
      expect(canRespondToHelpRequest(UserRole.VOLUNTEER)).toBe(true);
    });

    it('should return false for users (who cannot respond to requests)', () => {
      expect(canRespondToHelpRequest(UserRole.USER)).toBe(false);
    });

    it('should return false for invalid or null roles', () => {
      expect(canRespondToHelpRequest(null)).toBe(false);
      expect(canRespondToHelpRequest(undefined)).toBe(false);
      expect(canRespondToHelpRequest('admin')).toBe(false);
    });
  });
});
