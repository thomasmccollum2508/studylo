import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyALciv_C3rhtP1BDuQRT-g2ha1s8vMh0zg';

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.3,
      },
    });

    const fullContent = content.trim().substring(0, 50000);

    const prompt = `You are creating flashcards from study notes. Generate AS MANY flashcards as possible—do NOT limit to 10. Create a separate flashcard for every key concept, term, definition, fact, date, person, process, and detail in the notes. The more comprehensive, the better. Aim for dozens or hundreds of cards if the content supports it.

Each flashcard must have:
- "front": a question, term, or prompt
- "back": the answer, definition, or explanation

Return valid JSON only (no markdown, no code blocks). Format:
{"cards":[{"front":"...","back":"..."},{"front":"...","back":"..."},...]}

Study notes:
${fullContent}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response (handle markdown code blocks if present)
      let jsonText = text.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }

      const parsed = JSON.parse(jsonText);
      
      if (parsed.cards && Array.isArray(parsed.cards)) {
        return NextResponse.json({
          success: true,
          cards: parsed.cards,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Gemini API error:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      
      // Check for quota/rate limit errors
      if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'API quota exceeded. Please wait a moment and try again.'
          },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: `Failed to generate flashcards: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Generate flashcards error:', error);
    return NextResponse.json(
      { success: false, error: `An unexpected error occurred: ${error.message || error}` },
      { status: 500 }
    );
  }
}
