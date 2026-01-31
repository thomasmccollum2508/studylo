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
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.3,
      },
    });

    const fullContent = content.trim().substring(0, 50000);

    const prompt = `ACTION-PROMPT FLASHCARDS (QUIZLET-STYLE)

You are generating flashcards for a study app.
Flashcards must prompt recall without using: exam command words, full questions, or bare terms.
Each flashcard must clearly tell the learner what to remember.

🎯 CORE RULE
Every flashcard front must:
- Contain an action cue
- Lead to one clear answer
- Never be just a term on its own
If the front does not guide recall, it is incorrect.

1️⃣ FLASHCARD STRUCTURE (STRICT)
Front: A short recall prompt (no question mark)
Back: ONE short sentence answer

2️⃣ FRONT SIDE — REQUIRED PROMPT PATTERNS
Use ONLY these formats:
- Meaning of …
- Cause of …
- Effect of …
- Reason for …
- Result of …
- Purpose of …
- Key problem of …
- Main idea behind …
- Impact of …
- Outcome of …

Do NOT use: What is … | Explain … | Describe … | Just a term alone

3️⃣ FIXING BAD OUTPUT (ENFORCED)
❌ WRONG (no recall cue): Weimar Republic weaknesses | Hyperinflation (1923) | Hitler's belief after WWI
These fail because they do not prompt recall.

✅ CORRECT:
Front: Key weakness of the Weimar Republic
Back: It had a weak government that struggled to make strong decisions.

Front: Effect of hyperinflation in Germany (1923)
Back: Money lost its value and people could not afford basic goods.

Front: Main belief Hitler held after World War I
Back: He believed Germany was betrayed and unfairly treated.

4️⃣ BACK SIDE RULES (STRICT)
Each answer must: Be one short sentence | Be simple language | Contain one fact only | Avoid commas stacking ideas

5️⃣ FLASHCARD COUNT
Generate 4–8 flashcards per section. Quality over quantity.

6️⃣ FINAL QUALITY CHECK (MANDATORY)
Before outputting a card, ask: If I saw only the front, would I know exactly what to recall? If NO → rewrite.

END RESULT: Flashcards will feel exactly like Quizlet cards, actively trigger memory, avoid exam-style overload, avoid dead "word-only" cards, and work perfectly with Learn / mastery mode.

Return valid JSON only (no markdown, no code blocks). Format:
{"cards":[{"front":"...","back":"..."},{"front":"...","back":"..."},...]}

Section of notes:
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
