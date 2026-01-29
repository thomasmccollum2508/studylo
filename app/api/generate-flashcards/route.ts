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

    const prompt = `EXAM-STYLE AI FLASHCARD GENERATOR (NO "WHAT IS")

You are generating flashcards for a study app. Your goal is to create exam-style recall questions, not dictionary definitions.

⚠️ ABSOLUTE RULE:
The phrase "What is" must NEVER appear in any question.

🎯 CORE GOAL
Each flashcard must:
- Mimic real exam questions
- Test understanding, not memorisation only
- Still have one clear correct answer (for Learn mode)

STEP 1 — CONCEPT SELECTION
Extract only:
- Exam-relevant concepts
- Processes
- Reasons
- Effects
- Purposes
- Characteristics
- Comparisons

Ignore:
- Filler text
- Examples unless directly examinable
- Descriptive adjectives without meaning
- Any phrase that cannot be questioned clearly

STEP 2 — QUESTION STYLE RULES (MANDATORY)
Each flashcard question must start with one of these formats only:

✅ ALLOWED QUESTION STARTERS
- Explain why …
- Explain how …
- Describe …
- Give ONE reason why …
- State TWO characteristics of …
- Explain the importance of …
- Identify and explain …
- Compare …
- Give ONE effect of …
- Give ONE purpose of …
- Outline …
- Name and explain …
- State and explain …

🚫 BANNED
- What is …
- Define …
- This refers to …
- Explain what …
- Any vague phrasing

STEP 3 — ANSWER RULES (QUIZLET-STYLE COMPATIBLE)
Each answer must:
- Be short but complete
- Match the wording expected in exams
- Contain only essential info
- Be scorable as correct / incorrect
Format answers as: 1–3 short sentences, OR bullet points (max 3 bullets).

STEP 4 — EXAM REALISM FILTER
Before returning a flashcard, check: Could this exact question appear in a school exam paper? If NO → delete it.

STEP 5 — GOOD vs BAD (ENFORCED)
❌ BAD (DELETE): What is Baroque music? / What is referred to as terraced dynamics? / What is richness in music?

✅ GOOD (KEEP):
Q: Explain why terraced dynamics were commonly used in Baroque music.
A: Baroque instruments like the harpsichord could not gradually change volume, so composers used sudden changes between loud and soft.

Q: Describe TWO characteristics of Baroque music.
A: • Complex melodic lines • Use of polyphonic texture

Q: Give ONE purpose of basso continuo in Baroque music.
A: It provided harmonic support and structure to the music.

STEP 6 — LEARN MODE COMPATIBILITY
Each flashcard must: test one idea only; have one correct answer; be suitable for Know / Don’t know, Mastered tracking, and Repetition. No multi-part essay questions.

STEP 7 — FINAL CHECK (STRICT)
Read the question out loud. If it sounds like: a definition → ❌ | a sentence fragment → ❌ | a Google snippet → ❌ → Delete it.

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
