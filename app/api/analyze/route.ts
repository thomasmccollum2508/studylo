import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/** Instructions for the AI when turning user content into notes (full, exam-ready notes – not summaries). */
const EXAM_NOTES_SYSTEM_INSTRUCTIONS = `Your task is to create FULL, DETAILED, EXAM-READY NOTES.
🔒 NON-NEGOTIABLE RULES
Do NOT summarise
Do NOT skip any topic
Do NOT combine topics
Do NOT assume prior knowledge
Do NOT write short or generic notes
If any examinable concept is missing, the output is incorrect.

📐 REQUIRED FORMAT (MUST MATCH EXACTLY)
Start with:
[SUBJECT]
TOPIC NAME
FULL NOTES WITH DEFINITIONS

🧱 STRUCTURE RULES
Use numbered sections
Each major concept must include:
Definition
Key Points
Examples (where applicable)
Use clear sub-headings such as:
Definition
Key Points
Examples
Reasons
Results
Importance
Rewards (for economics topics)
Use bullet points under sub-headings
Leave clear spacing between sections
End with:
KEY DEFINITIONS TO MEMORISE (EXAM SECTION)

🧠 CONTENT RULES
Write in simple Grade 8–9 language
Use a teacher / textbook tone
Explain concepts step-by-step
Include real-life and South African examples where possible
Cover the topic from start to finish, even if it feels obvious

🎯 QUALITY STANDARD
The notes must:
Be suitable for copying into a school notebook
Be detailed enough to study from without a textbook
Look like teacher-approved notes

🚫 FINAL CHECK
Before finishing:
Confirm that every examinable heading is covered
Confirm that all key terms are defined clearly

✅ OUTPUT GOAL
Produce complete, structured, exam-ready notes, not summaries.`;

/** Builds the formatting suffix for Gemini (HTML tags, no Markdown). */
function htmlFormattingInstructions(): string {
  return `
IMPORTANT FORMATTING INSTRUCTIONS:
- Use HTML tags for formatting, NOT Markdown symbols
- Use <strong>text</strong> for bold text (NOT **text** or *text*)
- Use <em>text</em> for italic text (NOT *text*)
- Use <h2>text</h2> for section headings
- Use <h3>text</h3> for subsection headings
- Use <ul><li>item</li></ul> for bullet lists
- Use <ol><li>item</li></ol> for numbered lists
- Use <p>text</p> for paragraphs
- Do NOT use Markdown symbols like **, *, #, -, etc.
- Format the output in a clear, organized manner with proper HTML sections`;
}

/** Strip markdown code fences (e.g. ```html, ```) that the model sometimes returns. */
function stripMarkdownCodeFences(text: string): string {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\s*```[a-zA-Z0-9]*\s*/g, '')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const inputMethod = formData.get('inputMethod') as string;
    const textContent = formData.get('textContent') as string | null;
    const imageData = formData.get('imageData') as string | null;
    const files = formData.getAll('files') as File[];

    console.log('Analysis request:', { inputMethod, hasText: !!textContent, hasImage: !!imageData, fileCount: files.length });

    // Initialize Gemini
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Use gemini-2.5-flash-lite as requested
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    let contentToAnalyze = '';

    // Handle different input methods
    if (inputMethod === 'paste' && textContent) {
      contentToAnalyze = textContent;
    } else if (inputMethod === 'upload' && files.length > 0) {
      // For uploaded files, extract text from various file types
      const textFiles: string[] = [];
      const imageFiles: { name: string; data: string; mimeType: string }[] = [];
      
      for (const file of files) {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        
        if (fileType.startsWith('text/') || fileName.endsWith('.txt')) {
          // Text files
          const text = await file.text();
          textFiles.push(`\n\n--- File: ${file.name} ---\n${text}`);
        } else if (fileName.endsWith('.pdf')) {
          // PDF files - use Gemini vision API to extract text (more reliable)
          try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            imageFiles.push({
              name: file.name,
              data: base64,
              mimeType: 'application/pdf'
            });
          } catch (error: any) {
            console.error(`Error processing PDF ${file.name}:`, error);
            textFiles.push(`\n\n--- File: ${file.name} (PDF - could not process) ---`);
          }
        } else if (fileName.endsWith('.docx')) {
          // Word documents (.docx) - try mammoth first, fallback to Gemini vision API
          try {
            // Try to use mammoth if available
            let mammothModule;
            try {
              mammothModule = await import('mammoth');
            } catch (importError) {
              // mammoth not installed, use Gemini vision API instead
              throw new Error('mammoth_not_available');
            }
            
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result = await mammothModule.default.extractRawText({ buffer });
            const extractedText = result.value;
            if (extractedText && extractedText.trim()) {
              textFiles.push(`\n\n--- File: ${file.name} (Word Document) ---\n${extractedText}`);
            } else {
              // If raw text extraction fails, try with formatted text
              const formattedResult = await mammothModule.default.convertToHtml({ buffer });
              const htmlText = formattedResult.value;
              // Strip HTML tags for text extraction
              const plainText = htmlText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
              if (plainText) {
                textFiles.push(`\n\n--- File: ${file.name} (Word Document) ---\n${plainText}`);
              } else {
                textFiles.push(`\n\n--- File: ${file.name} (Word Document - could not extract text) ---`);
              }
            }
          } catch (error: any) {
            // Fallback: use Gemini vision API for Word documents
            if (error.message === 'mammoth_not_available' || error.message?.includes('Cannot find module')) {
              console.log(`Mammoth not available, using Gemini vision API for ${file.name}`);
            } else {
              console.error(`Error processing Word document with mammoth ${file.name}:`, error);
            }
            
            try {
              const arrayBuffer = await file.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const base64 = buffer.toString('base64');
              imageFiles.push({
                name: file.name,
                data: base64,
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              });
            } catch (fallbackError: any) {
              console.error(`Fallback error processing Word document ${file.name}:`, fallbackError);
              textFiles.push(`\n\n--- File: ${file.name} (Word Document - could not process) ---`);
            }
          }
        } else if (fileName.endsWith('.doc')) {
          // Older .doc format - try using Gemini vision API (mammoth doesn't support .doc)
          try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            imageFiles.push({
              name: file.name,
              data: base64,
              mimeType: 'application/msword'
            });
          } catch (error: any) {
            console.error(`Error processing Word document ${file.name}:`, error);
            textFiles.push(`\n\n--- File: ${file.name} (Word Document - could not process) ---`);
          }
        } else if (fileType.startsWith('image/')) {
          // Image files - convert to base64 for Gemini vision API
          try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            imageFiles.push({
              name: file.name,
              data: base64,
              mimeType: fileType
            });
          } catch (error: any) {
            console.error(`Error processing image ${file.name}:`, error);
            textFiles.push(`\n\n--- File: ${file.name} (Image - could not process) ---`);
          }
        } else {
          // Other file types - try to read as text
          try {
            const text = await file.text();
            if (text.trim()) {
              textFiles.push(`\n\n--- File: ${file.name} ---\n${text}`);
            } else {
              textFiles.push(`\n\n--- File: ${file.name} (${fileType} - no text content) ---`);
            }
          } catch (error) {
            textFiles.push(`\n\n--- File: ${file.name} (${fileType} - could not read) ---`);
          }
        }
      }
      
      // If we have images, use Gemini vision API to extract text from them
      if (imageFiles.length > 0) {
        try {
          const imageTexts: string[] = [];
          
          for (const imageFile of imageFiles) {
            try {
              // Determine correct MIME type for Gemini
              let geminiMimeType = imageFile.mimeType;
              if (imageFile.mimeType === 'application/pdf') {
                geminiMimeType = 'application/pdf';
              } else if (imageFile.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                         imageFile.mimeType === 'application/msword') {
                // Word documents - Gemini can process these
                geminiMimeType = imageFile.mimeType;
              } else if (!imageFile.mimeType || imageFile.mimeType === 'application/octet-stream') {
                // Try to detect from file extension
                if (imageFile.name.toLowerCase().endsWith('.png')) {
                  geminiMimeType = 'image/png';
                } else if (imageFile.name.toLowerCase().endsWith('.jpg') || imageFile.name.toLowerCase().endsWith('.jpeg')) {
                  geminiMimeType = 'image/jpeg';
                } else if (imageFile.name.toLowerCase().endsWith('.gif')) {
                  geminiMimeType = 'image/gif';
                } else if (imageFile.name.toLowerCase().endsWith('.webp')) {
                  geminiMimeType = 'image/webp';
                } else {
                  geminiMimeType = 'image/png'; // Default fallback
                }
              }
              
              // Create appropriate prompt based on file type
              let extractionPrompt = 'Extract all text content from this file. Return only the extracted text, preserving the structure and formatting as much as possible. Do not summarize or analyze, just extract the raw text content.';
              
              if (imageFile.mimeType.includes('word') || imageFile.mimeType.includes('msword')) {
                extractionPrompt = 'Extract all text content from this Word document. Return only the extracted text, preserving the structure, formatting, headings, lists, and paragraphs as much as possible. Include all content from all pages. Do not summarize or analyze, just extract the raw text content.';
              } else if (imageFile.mimeType.includes('pdf')) {
                extractionPrompt = 'Extract all text content from this PDF. Return only the extracted text, preserving the structure and formatting as much as possible. Include all content from all pages. Do not summarize or analyze, just extract the raw text content.';
              }
              
              const result = await model.generateContent([
                {
                  inlineData: {
                    data: imageFile.data,
                    mimeType: geminiMimeType
                  }
                },
                {
                  text: extractionPrompt
                }
              ]);
              
              const response = await result.response;
              const extractedText = response.text();
              
              const fileTypeLabel = imageFile.mimeType.includes('pdf') ? 'PDF' 
                : imageFile.mimeType.includes('word') || imageFile.mimeType.includes('msword') ? 'Word Document'
                : 'Image';
              imageTexts.push(`\n\n--- File: ${imageFile.name} (${fileTypeLabel}) ---\n${extractedText}`);
            } catch (error: any) {
              console.error(`Error extracting text from ${imageFile.name}:`, error);
              imageTexts.push(`\n\n--- File: ${imageFile.name} (could not extract text) ---`);
            }
          }
          
          textFiles.push(...imageTexts);
        } catch (error: any) {
          console.error('Error processing images:', error);
        }
      }
      
      contentToAnalyze = textFiles.join('\n');
      
      if (!contentToAnalyze.trim()) {
        return NextResponse.json(
          { success: false, error: 'Could not extract any text from the uploaded files.' },
          { status: 400 }
        );
      }
    } else if (inputMethod === 'camera' && imageData) {
      // For images, first extract text using Gemini vision, then summarize
      let imageBase64 = imageData;
      let mimeType = 'image/png';
      
      // Handle data URL format (data:image/png;base64,...)
      if (imageData.includes(',')) {
        const parts = imageData.split(',');
        imageBase64 = parts[1];
        if (parts[0].includes('data:')) {
          const mimeMatch = parts[0].match(/data:([^;]+)/);
          if (mimeMatch) {
            mimeType = mimeMatch[1];
          }
        }
      }
      
      try {
        // Step 1: Extract text from image
        console.log('Extracting text from image...');
        const extractResult = await model.generateContent([
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType
            }
          },
          {
            text: 'Extract all text content from this image. Return only the extracted text, preserving the structure and formatting as much as possible. Do not summarize or analyze, just extract the raw text content.'
          }
        ]);
        
        const extractResponse = await extractResult.response;
        const extractedText = extractResponse.text();
        
        if (!extractedText.trim()) {
          // If no text found, analyze the image content directly
          console.log('No text found in image, analyzing image content...');
          const analyzeResult = await model.generateContent([
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType
              }
            },
            {
              text: `${EXAM_NOTES_SYSTEM_INSTRUCTIONS}

Turn the content in this image into full, exam-ready notes. Extract ALL text and key information. Do NOT summarise—expand and structure everything into the required format (numbered sections, Definition, Key Points, Examples, KEY DEFINITIONS TO MEMORISE at the end).${htmlFormattingInstructions()}`
            }
          ]);
          
          const analyzeResponse = await analyzeResult.response;
          const notesFromImage = stripMarkdownCodeFences(analyzeResponse.text());
          return NextResponse.json({
            success: true,
            summary: notesFromImage,
            source: 'image'
          });
        }
        
        // Step 2: Summarize the extracted text
        console.log('Summarizing extracted text...');
        const prompt = `${EXAM_NOTES_SYSTEM_INSTRUCTIONS}

Turn the following content (extracted from an image) into full, exam-ready notes. Do NOT summarise—use every topic and concept to build complete notes in the required format (numbered sections, Definition, Key Points, Examples, KEY DEFINITIONS TO MEMORISE at the end). Cover every examinable heading.

Content extracted from image:
${extractedText}
${htmlFormattingInstructions()}`;

        const summaryResult = await model.generateContent(prompt);
        const summaryResponse = await summaryResult.response;
        const notesFromExtractedText = stripMarkdownCodeFences(summaryResponse.text());
        return NextResponse.json({
          success: true,
          summary: notesFromExtractedText,
          source: 'image'
        });
      } catch (error: any) {
        console.error('Gemini API error:', error);
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        
        // Check for quota/rate limit errors
        if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'API quota exceeded. Please wait a moment and try again, or check your Google Cloud billing/quota settings.'
            },
            { status: 429 }
          );
        }
        
        return NextResponse.json(
          { success: false, error: `Failed to analyze image: ${errorMessage}` },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'No content provided for analysis' },
        { status: 400 }
      );
    }

    // For text content, generate summary
    if (contentToAnalyze.trim()) {
      // Limit content length to avoid token limits (roughly 30k characters)
      const maxLength = 30000;
      const truncatedContent = contentToAnalyze.length > maxLength 
        ? contentToAnalyze.substring(0, maxLength) + '\n\n[Content truncated due to length...]'
        : contentToAnalyze;

      const prompt = `${EXAM_NOTES_SYSTEM_INSTRUCTIONS}

Turn the following content (uploaded or pasted by the user) into full, exam-ready notes. Do NOT summarise—use every topic and concept to build complete notes in the required format (numbered sections, Definition, Key Points, Examples, KEY DEFINITIONS TO MEMORISE at the end). Cover every examinable heading; do not skip or combine topics.

Content to turn into notes:
${truncatedContent}
${htmlFormattingInstructions()}`;

      try {
        console.log('Sending request to Gemini API...');
        
        // Retry logic for rate limiting
        let retries = 3;
        let lastError: any = null;
        
        while (retries > 0) {
          try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const notesContent = stripMarkdownCodeFences(response.text());
            console.log('Successfully received response from Gemini');
            return NextResponse.json({
              success: true,
              summary: notesContent,
              source: inputMethod
            });
          } catch (error: any) {
            lastError = error;
            const errorMessage = error?.message || error?.toString() || '';
            
            // Check if it's a rate limit error (429)
            if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
              if (retries > 1) {
                // Extract retry delay from error if available
                const retryDelayMatch = errorMessage.match(/retry in (\d+\.?\d*)s/i);
                const delay = retryDelayMatch ? parseFloat(retryDelayMatch[1]) * 1000 : 5000;
                console.log(`Rate limit hit, retrying in ${delay}ms... (${retries - 1} retries left)`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retries--;
                continue;
              }
            }
            
            // If not a rate limit error or out of retries, throw
            throw error;
          }
        }
        
        // If we exhausted retries, throw the last error (no unreachable return here)
        throw lastError;
      } catch (error: any) {
        console.error('Gemini API error:', error);
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        
        // Check for quota/rate limit errors and provide user-friendly message
        if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'API quota exceeded. Please wait a moment and try again, or check your Google Cloud billing/quota settings. Free tier has daily and per-minute limits.'
            },
            { status: 429 }
          );
        }
        
        return NextResponse.json(
          { success: false, error: `Failed to analyze content: ${errorMessage}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'No valid content to analyze' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Analysis error:', error);
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    return NextResponse.json(
      { success: false, error: `An unexpected error occurred: ${errorMessage}` },
      { status: 500 }
    );
  }
}
