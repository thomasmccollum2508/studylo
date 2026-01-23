import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyALciv_C3rhtP1BDuQRT-g2ha1s8vMh0zg';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const inputMethod = formData.get('inputMethod') as string;
    const textContent = formData.get('textContent') as string | null;
    const imageData = formData.get('imageData') as string | null;
    const files = formData.getAll('files') as File[];

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let contentToAnalyze = '';

    // Handle different input methods
    if (inputMethod === 'paste' && textContent) {
      contentToAnalyze = textContent;
    } else if (inputMethod === 'upload' && files.length > 0) {
      // For uploaded files, extract text from text files
      // For PDFs and images, we'll need to handle them differently
      const textFiles: string[] = [];
      
      for (const file of files) {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        
        if (fileType.startsWith('text/') || fileName.endsWith('.txt')) {
          const text = await file.text();
          textFiles.push(`\n\n--- File: ${file.name} ---\n${text}`);
        } else if (fileName.endsWith('.pdf')) {
          // PDF handling would require a PDF parser library
          // For now, we'll note that PDF support needs additional setup
          textFiles.push(`\n\n--- File: ${file.name} (PDF - text extraction not yet implemented) ---`);
        } else {
          textFiles.push(`\n\n--- File: ${file.name} (${fileType}) ---`);
        }
      }
      
      contentToAnalyze = textFiles.join('\n');
    } else if (inputMethod === 'camera' && imageData) {
      // For images, we'll use Gemini's vision capabilities
      // The image data should be a base64 string
      const imageBase64 = imageData.split(',')[1] || imageData;
      
      try {
        const result = await model.generateContent([
          {
            inlineData: {
              data: imageBase64,
              mimeType: 'image/png'
            }
          },
          {
            text: 'Please analyze this image and provide a comprehensive summary of the content. Extract all text and key information, and organize it in a clear, structured format.'
          }
        ]);
        
        const response = await result.response;
        const summary = response.text();
        
        return NextResponse.json({ 
          success: true, 
          summary,
          source: 'image'
        });
      } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to analyze image. Please try again.' },
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
      const prompt = `Please analyze and summarize the following content. Provide a comprehensive summary that includes:

1. Main topics and key concepts
2. Important details and facts
3. Key takeaways
4. Any important dates, names, or numbers mentioned

Content to analyze:
${contentToAnalyze}

Please format the summary in a clear, organized manner with proper sections.`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        return NextResponse.json({ 
          success: true, 
          summary,
          source: inputMethod
        });
      } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to analyze content. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'No valid content to analyze' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
