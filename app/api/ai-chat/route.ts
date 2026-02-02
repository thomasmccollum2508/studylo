import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyALciv_C3rhtP1BDuQRT-g2ha1s8vMh0zg';

const BASE_SYSTEM = `You are a friendly, knowledgeable study assistant for StudyLo. You help students with:
- Understanding notes, concepts, and definitions
- Answering questions about their study material
- Explaining answers and giving hints without spoiling
- Study tips, memorization strategies, and how to prepare for quizzes

Keep responses clear, concise, and encouraging. Use simple language when explaining. You can use bullet points or short paragraphs. Support markdown for readability (e.g. **bold**, lists). Do not make up facts—if unsure, say so.`;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI chat is not configured. Add GEMINI_API_KEY to your environment.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { messages, studySetContext } = body as {
      messages?: Array<{ role: 'user' | 'model'; parts: { text: string }[] }>;
      studySetContext?: { title?: string; notesExcerpt?: string; terms?: string[] };
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required and must not be empty' },
        { status: 400 }
      );
    }

    let systemInstruction = BASE_SYSTEM;
    if (studySetContext && (studySetContext.notesExcerpt || (studySetContext.terms && studySetContext.terms.length > 0))) {
      const parts: string[] = [
        'The user is chatting about a specific study set. Use ONLY the following material to answer—base your answers on these notes and terms. Do not invent content that is not present here.',
        studySetContext.title ? `Study set title: ${studySetContext.title}` : '',
        studySetContext.notesExcerpt
          ? `\nNotes/content (use this as the main reference):\n${studySetContext.notesExcerpt}`
          : '',
        studySetContext.terms && studySetContext.terms.length > 0
          ? `\nTerms and definitions in this set:\n${studySetContext.terms
              .map((t: unknown) =>
                typeof t === 'string' ? t : typeof t === 'object' && t && 'front' in t && 'back' in t
                  ? `${(t as { front: string }).front} → ${(t as { back: string }).back}`
                  : String(t)
              )
              .join('\n')}`
          : '',
      ].filter(Boolean);
      systemInstruction = `${BASE_SYSTEM}\n\n${parts.join('\n')}`;
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.parts.map((p) => p.text).join('') }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from user' },
        { status: 400 }
      );
    }
    const userText = lastMessage.parts.map((p) => p.text).join('');

    const result = await chat.sendMessage(userText);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (err) {
    console.error('AI chat error:', err);
    return NextResponse.json(
      { error: 'Failed to get a response from the AI. Please try again.' },
      { status: 500 }
    );
  }
}
