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
              
              const result = await model.generateContent([
                {
                  inlineData: {
                    data: imageFile.data,
                    mimeType: geminiMimeType
                  }
                },
                {
                  text: 'Extract all text content from this image or PDF. Return only the extracted text, preserving the structure and formatting as much as possible. Do not summarize or analyze, just extract the raw text content.'
                }
              ]);
              
              const response = await result.response;
              const extractedText = response.text();
              imageTexts.push(`\n\n--- File: ${imageFile.name} (${imageFile.mimeType.includes('pdf') ? 'PDF' : 'Image'}) ---\n${extractedText}`);
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
              text: `Please analyze this image and provide a comprehensive summary of the content. Extract all text and key information, and organize it in a clear, structured format.

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

Example format:
<strong>Photosynthesis</strong> is the process by which plants use sunlight to make food.
<strong>Raw materials:</strong> water, carbon dioxide, and sunlight.
<strong>Products:</strong> glucose (food) and oxygen.`
            }
          ]);
          
          const analyzeResponse = await analyzeResult.response;
          const summary = analyzeResponse.text();
          
          return NextResponse.json({ 
            success: true, 
            summary,
            source: 'image'
          });
        }
        
        // Step 2: Summarize the extracted text
        console.log('Summarizing extracted text...');
        const prompt = `Please analyze and summarize the following content extracted from an image. Provide a comprehensive summary that includes:

1. Main topics and key concepts
2. Important details and facts
3. Key takeaways
4. Any important dates, names, or numbers mentioned

Content extracted from image:
${extractedText}

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
- Format the summary in a clear, organized manner with proper HTML sections

Example format:
<strong>Photosynthesis</strong> is the process by which plants use sunlight to make food.
<strong>Raw materials:</strong> water, carbon dioxide, and sunlight.
<strong>Products:</strong> glucose (food) and oxygen.`;

        const summaryResult = await model.generateContent(prompt);
        const summaryResponse = await summaryResult.response;
        const summary = summaryResponse.text();
        
        return NextResponse.json({ 
          success: true, 
          summary,
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

      const prompt = `Please analyze and summarize the following content. Provide a comprehensive summary that includes:

1. Main topics and key concepts
2. Important details and facts
3. Key takeaways
4. Any important dates, names, or numbers mentioned

Content to analyze:
${truncatedContent}

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
- Format the summary in a clear, organized manner with proper HTML sections

Example format:
<strong>Photosynthesis</strong> is the process by which plants use sunlight to make food.
<strong>Raw materials:</strong> water, carbon dioxide, and sunlight.
<strong>Products:</strong> glucose (food) and oxygen.`;

      try {
        console.log('Sending request to Gemini API...');
        
        // Retry logic for rate limiting
        let retries = 3;
        let lastError: any = null;
        
        while (retries > 0) {
          try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text();
            console.log('Successfully received response from Gemini');
            
            return NextResponse.json({ 
              success: true, 
              summary,
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
        
        // If we exhausted retries, throw the last error
        throw lastError;

        return NextResponse.json({ 
          success: true, 
          summary,
          source: inputMethod
        });
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
