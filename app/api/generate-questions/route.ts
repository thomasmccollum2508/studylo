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
    const { content, count = 6 } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `Based on the following study notes, generate ${count} practice questions with answers. Each question should:
1. Test understanding of key concepts
2. Have a clear, concise answer
3. Be assigned a difficulty level (Easy, Medium, or Hard)
4. Cover different topics from the notes

Return the questions in the following JSON format (valid JSON only, no markdown):
{
  "questions": [
    {
      "question": "Question text here",
      "answer": "Answer text here",
      "difficulty": "Easy" or "Medium" or "Hard"
    }
  ]
}

Study notes:
${content.substring(0, 30000)}`;

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
      
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return NextResponse.json({
          success: true,
          questions: parsed.questions,
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
        { success: false, error: `Failed to generate questions: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Generate questions error:', error);
    return NextResponse.json(
      { success: false, error: `An unexpected error occurred: ${error.message || error}` },
      { status: 500 }
    );
  }
}
