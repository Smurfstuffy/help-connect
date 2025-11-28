import {UserRole} from '@/types/app/register';

/**
 * Validates if a string is a valid user role
 * @param role - The role string to validate
 * @returns True if the role is valid, false otherwise
 */
export function isValidUserRole(role: string | null | undefined): boolean {
  return role === UserRole.USER || role === UserRole.VOLUNTEER;
}

/**
 * Checks if a user has the 'user' role
 * @param role - The user's role
 * @returns True if the user has the 'user' role, false otherwise
 */
export function isUserRole(role: string | null | undefined): boolean {
  return role === UserRole.USER;
}

/**
 * Checks if a user has the 'volunteer' role
 * @param role - The user's role
 * @returns True if the user has the 'volunteer' role, false otherwise
 */
export function isVolunteerRole(role: string | null | undefined): boolean {
  return role === UserRole.VOLUNTEER;
}

/**
 * Checks if a user can create help requests (only 'user' role can create requests)
 * @param role - The user's role
 * @returns True if the user can create help requests, false otherwise
 */
export function canCreateHelpRequest(role: string | null | undefined): boolean {
  return isUserRole(role);
}

/**
 * Checks if a user can view and respond to help requests (volunteers can respond)
 * @param role - The user's role
 * @returns True if the user can respond to help requests, false otherwise
 */
export function canRespondToHelpRequest(
  role: string | null | undefined,
): boolean {
  return isVolunteerRole(role);
}
