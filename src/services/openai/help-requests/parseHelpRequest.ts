import {openai, OPENAI_CONFIG} from '@/lib/openai';
import {
  HelpRequestCategory,
  HelpRequestUrgency,
  CATEGORY_OPTIONS,
  URGENCY_OPTIONS,
} from '@/types/app/enums';

export interface ParsedHelpRequest {
  city: string;
  category: HelpRequestCategory;
  urgency: HelpRequestUrgency;
  description: string;
}

export interface ParseHelpRequestError {
  error: true;
  message: string;
}

export type ParseHelpRequestResult = ParsedHelpRequest | ParseHelpRequestError;

/**
 * Parses free-form text describing a help request into structured data.
 * Uses OpenAI to extract: city, category, urgency, and description.
 *
 * @param text - Free-form text describing the help request
 * @returns Parsed help request data or error message if insufficient information
 */
export async function parseHelpRequest(
  text: string,
): Promise<ParseHelpRequestResult> {
  const prompt = `You are a helpful assistant that extracts structured information from free-form text describing help requests.

Your task is to analyze the user's text and extract the following information:

1. **City** (required): The location/city where help is needed. Extract city names mentioned in the text. If multiple cities are mentioned (e.g., "from Lviv to Drohobych"), use the primary destination or the most relevant one. If no city is mentioned, return null.

2. **Category** (required): Must be one of these exact values:
   - "Food" - for food, meals, groceries, nutrition, feeding
   - "Transportation" - for transport, moving, travel, vehicles, rides, logistics
   - "Medical" - for medical care, health, medicine, doctors, hospitals, treatment
   - "Shelter" - for housing, accommodation, places to stay, temporary housing
   - "Clothing" - for clothes, garments, apparel, winter clothing, basic needs clothing
   - "Other" - for anything that doesn't fit the above categories

   Match the category based on keywords and context. Be flexible - "transporting things" = Transportation, "need a place to stay" = Shelter, "need food" = Food, etc.

3. **Urgency** (required): Must be one of these exact values:
   - "Low" - not urgent, can wait days/weeks
   - "Medium" - moderate urgency, needed within a few days
   - "High" - urgent, needed soon (within 24-48 hours)
   - "Critical" - extremely urgent, needed immediately/asap

   Infer urgency from time indicators: "asap", "urgent", "immediately", "today", "this week", "by the end of the week", "soon", etc. If no urgency is mentioned, default to "Medium".

4. **Description** (required): A clear, detailed description of the help request. Use the original text, but clean it up and make it more structured if needed. Keep it informative and descriptive.

**Important Rules:**
- If the text provides insufficient information (e.g., too vague, missing critical details like location or what kind of help is needed), return an error message asking for more details.
- If you can extract at least 3 out of 4 required fields with reasonable confidence, proceed with fallbacks for missing fields.
- For missing city: use "Not specified" as fallback
- For missing category: use "Other" as fallback
- For missing urgency: use "Medium" as fallback
- For missing description: use a brief summary based on available information

**Output Format:**
Return a valid JSON object with this exact structure:
{
  "city": "string or null",
  "category": "Food" | "Transportation" | "Medical" | "Shelter" | "Clothing" | "Other",
  "urgency": "Low" | "Medium" | "High" | "Critical",
  "description": "string"
}

OR if information is insufficient, return:
{
  "error": true,
  "message": "Please provide more details about your request. For example: What kind of help do you need? Where is it needed? When is it needed?"
}

**Examples:**

Input: "We need help with transporting things for displaced people from Lviv to Drohobych"
Output: {
  "city": "Drohobych",
  "category": "Transportation",
  "urgency": "Medium",
  "description": "We need help with transporting things for displaced people from Lviv to Drohobych"
}

Input: "Urgent medical assistance needed in Kyiv"
Output: {
  "city": "Kyiv",
  "category": "Medical",
  "urgency": "High",
  "description": "Urgent medical assistance needed in Kyiv"
}

Input: "help"
Output: {
  "error": true,
  "message": "Please provide more details about your request. For example: What kind of help do you need? Where is it needed? When is it needed?"
}

Now parse this text:
"${text}"

Return only the JSON object, nothing else:`;

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that extracts structured information from help requests. Always return valid JSON only, no additional text or explanations. Use the exact format specified in the prompt.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: OPENAI_CONFIG.temperature,
      max_tokens: OPENAI_CONFIG.maxTokens,
      response_format: {type: 'json_object'},
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      return {
        error: true,
        message:
          'Failed to process your request. Please try again or use the form instead.',
      };
    }

    const parsed = JSON.parse(content) as
      | ParsedHelpRequest
      | ParseHelpRequestError;

    // Validate the parsed result
    if ('error' in parsed && parsed.error) {
      return parsed;
    }

    // Type guard: at this point, parsed is ParsedHelpRequest
    const result = parsed as ParsedHelpRequest;

    // Validate required fields
    if (
      !result.city ||
      !result.category ||
      !result.urgency ||
      !result.description
    ) {
      return {
        error: true,
        message:
          'Please provide more details about your request. For example: What kind of help do you need? Where is it needed? When is it needed?',
      };
    }

    // Validate category is one of the allowed values
    if (!CATEGORY_OPTIONS.includes(result.category)) {
      result.category = 'Other' as HelpRequestCategory;
    }

    // Validate urgency is one of the allowed values
    if (!URGENCY_OPTIONS.includes(result.urgency)) {
      result.urgency = 'Medium' as HelpRequestUrgency;
    }

    // Handle null city
    if (
      !result.city ||
      result.city === 'null' ||
      result.city === 'Not specified'
    ) {
      return {
        error: true,
        message:
          'Please specify the city or location where help is needed. This information is required.',
      };
    }

    return result;
  } catch (error) {
    console.error('Error parsing help request:', error);
    return {
      error: true,
      message:
        'Failed to process your request. Please try again or use the form instead.',
    };
  }
}
