import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyALciv_C3rhtP1BDuQRT-g2ha1s8vMh0zg';

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, expectedConcept, studentAnswer } = body;

    if (!prompt || expectedConcept == null || !studentAnswer || typeof studentAnswer !== 'string') {
      return NextResponse.json(
        { success: false, error: 'prompt, expectedConcept, and studentAnswer are required' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.2,
      },
    });

    const evaluationPrompt = `SEMANTIC ANSWER EVALUATION (TYPED RESPONSES)

You are evaluating a student's typed answer in Learn mode or a practice test.
There is no fixed correct answer string. Your job is to decide whether the student demonstrates correct understanding.

CORE GOAL: Mark the answer as Correct if the learner shows the main idea, uses reasonable wording, and communicates the key concept even imperfectly. Do NOT require perfect phrasing.

INPUTS:
- Prompt shown to the student: ${JSON.stringify(prompt)}
- Expected concept (internal reference): ${JSON.stringify(expectedConcept)}
- Student's typed answer: ${JSON.stringify(studentAnswer.trim())}

HOW TO EVALUATE:
Mark Correct if: The answer includes the core meaning | Minor wording, grammar, or spelling mistakes | One key idea is stated clearly.
Mark Incorrect if: The core idea is missing | The answer is unrelated or vague | The answer contradicts the concept.
Do NOT penalise: Short answers, informal wording, partial sentences.

STRICT RULE: Do NOT over-require detail. If the expected concept is "Hyperinflation caused money to lose value", then "Money became worthless", "People's money had no value", "Prices rose so fast money was useless" are all Correct. Do NOT require dates, names, or extra explanations.

Assume the learner is Grade 7–10, not writing formally, recalling from memory. If the answer shows general understanding, accept it.

Before marking Incorrect, ask: Does this answer still show the main idea in simple terms? If YES → mark Correct.

Return ONLY valid JSON with no other text, no markdown, no code blocks:
{"result":"correct" or "incorrect","confidence":0.0 to 1.0,"feedback":"short encouraging sentence"}
If correct: feedback positive and short (e.g. "Good understanding of the idea.").
If incorrect: encourage retry without revealing the answer (e.g. "Not quite — think about the main effect."). Do NOT explain the full answer.`;

    const result = await model.generateContent(evaluationPrompt);
    const response = result.response;
    const text = response.text().trim();

    let jsonText = text;
    if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
    }
    const parsed = JSON.parse(jsonText);

    const resultValue = parsed.result === 'correct' ? 'correct' : 'incorrect';
    const confidence = typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.8;
    const feedback = typeof parsed.feedback === 'string' ? parsed.feedback : (resultValue === 'correct' ? 'Good understanding.' : 'Not quite — try again.');

    return NextResponse.json({
      success: true,
      result: resultValue,
      confidence,
      feedback,
    });
  } catch (error: unknown) {
    console.error('Evaluate answer error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Evaluation failed: ${message}` },
      { status: 500 }
    );
  }
}
