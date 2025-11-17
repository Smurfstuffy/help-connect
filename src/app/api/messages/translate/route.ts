import {NextRequest, NextResponse} from 'next/server';
import {ApiResponse} from '@/types/chat';
import {
  translateMessage,
  TranslationLanguage,
} from '@/services/openai/messages/translateMessage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {text, targetLanguage} = body;

    if (!text || !targetLanguage) {
      return NextResponse.json(
        {success: false, error: 'text and targetLanguage are required'},
        {status: 400},
      );
    }

    // Validate target language
    const validLanguages: TranslationLanguage[] = ['ukrainian', 'english'];
    if (!validLanguages.includes(targetLanguage as TranslationLanguage)) {
      return NextResponse.json(
        {success: false, error: 'Invalid target language'},
        {status: 400},
      );
    }

    // Translate message
    const translatedText = await translateMessage({
      text,
      targetLanguage: targetLanguage as TranslationLanguage,
    });

    return NextResponse.json({
      success: true,
      data: {translatedText},
    } as ApiResponse<{translatedText: string}>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error translating message:', error);
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
