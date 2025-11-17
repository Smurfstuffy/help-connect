import {openai, OPENAI_TASK_CONFIGS} from '@/lib/openai';

export type TranslationLanguage = 'ukrainian' | 'english';

export interface TranslateMessageParams {
  text: string;
  targetLanguage: TranslationLanguage;
}

/**
 * Translates a message to the target language using OpenAI.
 *
 * @param params - Message text and target language
 * @returns Translated text
 */
export async function translateMessage(
  params: TranslateMessageParams,
): Promise<string> {
  const {text, targetLanguage} = params;

  // Map language names to language codes for better clarity in prompt
  const languageMap: Record<TranslationLanguage, string> = {
    ukrainian: 'Ukrainian',
    english: 'English',
  };

  const targetLanguageName = languageMap[targetLanguage];

  const prompt = `Translate the following text to ${targetLanguageName}. 
Only return the translated text, nothing else. Do not add any explanations, notes, or additional text.

Text to translate:
"${text}"

Translated text:`;

  try {
    const config = {
      model: OPENAI_TASK_CONFIGS.TITLE_GENERATION.model,
      temperature: 0.3, // Lower temperature for more consistent translations
      maxTokens: 500,
    };

    const response = await openai.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the given text to ${targetLanguageName} accurately, preserving the meaning and tone. Return only the translated text without any additional commentary.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });

    let translatedText = response.choices[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error('Failed to translate message');
    }

    // Remove quotes if the translation is wrapped in quotes
    translatedText = translatedText.replace(/^["']|["']$/g, '');

    return translatedText;
  } catch (error) {
    console.error('Error translating message:', error);
    throw error;
  }
}
