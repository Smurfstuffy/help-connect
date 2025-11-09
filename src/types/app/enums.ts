export const HELP_REQUEST_CATEGORY = {
  FOOD: 'Food',
  TRANSPORTATION: 'Transportation',
  MEDICAL: 'Medical',
  SHELTER: 'Shelter',
  CLOTHING: 'Clothing',
  OTHER: 'Other',
} as const;

export const HELP_REQUEST_URGENCY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

export type HelpRequestCategory =
  (typeof HELP_REQUEST_CATEGORY)[keyof typeof HELP_REQUEST_CATEGORY];

export type HelpRequestUrgency =
  (typeof HELP_REQUEST_URGENCY)[keyof typeof HELP_REQUEST_URGENCY];

export const CATEGORY_OPTIONS = Object.values(HELP_REQUEST_CATEGORY);
export const URGENCY_OPTIONS = Object.values(HELP_REQUEST_URGENCY);
