import {
  HelpRequestCategory,
  HelpRequestUrgency,
  CATEGORY_OPTIONS,
  URGENCY_OPTIONS,
} from '@/types/app/enums';
import {ParsedHelpRequest} from '@/services/openai/help-requests/parseHelpRequest';

/**
 * Validates if a category is a valid HelpRequestCategory
 * @param category - The category to validate
 * @returns True if the category is valid, false otherwise
 */
export function isValidCategory(
  category: string,
): category is HelpRequestCategory {
  return CATEGORY_OPTIONS.includes(category as HelpRequestCategory);
}

/**
 * Validates if an urgency level is a valid HelpRequestUrgency
 * @param urgency - The urgency to validate
 * @returns True if the urgency is valid, false otherwise
 */
export function isValidUrgency(urgency: string): urgency is HelpRequestUrgency {
  return URGENCY_OPTIONS.includes(urgency as HelpRequestUrgency);
}

/**
 * Normalizes a category value, defaulting to 'Other' if invalid
 * @param category - The category to normalize
 * @returns A valid HelpRequestCategory
 */
export function normalizeCategory(category: string): HelpRequestCategory {
  return isValidCategory(category) ? category : 'Other';
}

/**
 * Normalizes an urgency value, defaulting to 'Medium' if invalid
 * @param urgency - The urgency to normalize
 * @returns A valid HelpRequestUrgency
 */
export function normalizeUrgency(urgency: string): HelpRequestUrgency {
  return isValidUrgency(urgency) ? urgency : 'Medium';
}

/**
 * Validates a parsed help request object
 * @param result - The parsed help request to validate
 * @returns True if all required fields are present and valid, false otherwise
 */
export function validateParsedHelpRequest(
  result: Partial<ParsedHelpRequest>,
): result is ParsedHelpRequest {
  return (
    !!result.city &&
    result.city !== 'null' &&
    result.city !== 'Not specified' &&
    !!result.category &&
    isValidCategory(result.category) &&
    !!result.urgency &&
    isValidUrgency(result.urgency) &&
    !!result.description &&
    result.description.trim().length > 0
  );
}

/**
 * Validates if a city string is valid (not empty, null, or "Not specified")
 * @param city - The city string to validate
 * @returns True if the city is valid, false otherwise
 */
export function isValidCity(city: string | null | undefined): boolean {
  return (
    !!city &&
    city !== 'null' &&
    city !== 'Not specified' &&
    city.trim().length > 0
  );
}
