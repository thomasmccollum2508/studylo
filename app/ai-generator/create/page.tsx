'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';

type GenerationType = 'upload-notes' | 'paste-text' | 'flashcards' | 'quizzes' | 'study-sets';

const TYPE_LABELS: Record<GenerationType, string> = {
  'upload-notes': 'Upload Notes',
  'paste-text': 'Paste Text',
  'flashcards': 'AI Flashcards',
  'quizzes': 'AI Quizzes',
  'study-sets': 'AI Study Sets',
};

export default function CreatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const type = (searchParams.get('type') || 'upload-notes') as GenerationType;
  
  const [inputMethod, setInputMethod] = useState<'upload' | 'paste' | 'camera'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pastedText, setPastedText] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    setError('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(files);
    setError('');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setError('');
    
    // Validate input
    if (inputMethod === 'upload' && uploadedFiles.length === 0) {
      setError('Please upload at least one file.');
      return;
    }
    if (inputMethod === 'paste' && !pastedText.trim()) {
      setError('Please paste some text content.');
      return;
    }
    if (inputMethod === 'camera' && !capturedImage) {
      setError('Please capture or upload an image.');
      return;
    }

    setProcessing(true);

    try {
      // TODO: Implement AI processing logic here
      // For now, simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After processing, redirect to results or back to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <img 
              src={theme === 'dark' ? "/studylo%20logo%20dark.png" : "/studylo%20logo%202.png"}
              alt="StudyLo Logo" 
              className="h-10 w-auto transition-opacity duration-300"
            />
          </Link>
        </div>

        <nav className="flex-1 px-3">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Dashboard
          </Link>
          
          <Link href="/my-study-sets" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H14.5C15.3284 3 16 3.67157 16 4.5V17L10 14L4 17V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Study Sets
          </Link>

          <Link href="/flashcards" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 3H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Flashcards
          </Link>

          <Link href="/quizzes" className="flex items-center gap-3 px-3 py-2.5 mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="13" r="0.5" fill="currentColor"/>
            </svg>
            Quizzes
          </Link>

        </nav>

        <div className="p-3">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M16 10C16 10 15 12 10 12C5 12 4 10 4 10C4 10 5 8 10 8C15 8 16 10 16 10Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create {TYPE_LABELS[type]}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upload, paste, or capture your content</p>
            </div>
            <Link 
              href="/ai-generator"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Input Method Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setInputMethod('upload')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  inputMethod === 'upload'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Upload Files
              </button>
              <button
                onClick={() => setInputMethod('paste')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  inputMethod === 'paste'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Paste Text
              </button>
              <button
                onClick={() => setInputMethod('camera')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  inputMethod === 'camera'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Take Photo
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Upload Files Section */}
            {inputMethod === 'upload' && (
              <div className="space-y-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer bg-white dark:bg-gray-800"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 15V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V15" stroke="#0055FF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Drop files here or click to browse
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Supports PDF, DOC, DOCX, TXT, JPG, PNG
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Selected Files:</h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 4C5 2.89543 5.89543 2 7 2H13C14.1046 2 15 2.89543 15 4V16C15 17.1046 14.1046 18 13 18H7C5.89543 18 5 17.1046 5 16V4Z" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M7 6H13M7 10H13M7 14H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-sm text-gray-900 dark:text-gray-100">{file.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
                            }}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Paste Text Section */}
            {inputMethod === 'paste' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste your text content here
                  </label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your notes, textbook content, or any text you want to convert into study materials..."
                    className="w-full h-64 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {pastedText.length} characters
                  </p>
                </div>
              </div>
            )}

            {/* Camera/Image Section */}
            {inputMethod === 'camera' && (
              <div className="space-y-6">
                {!showCamera && !capturedImage && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={startCamera}
                      className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-center"
                    >
                      <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="13" r="4" stroke="#10B981" strokeWidth="2"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Use Camera</h3>
                    </button>
                    <div
                      onClick={() => cameraInputRef.current?.click()}
                      className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-center cursor-pointer"
                    >
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 10L12 5L17 10" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5V15" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Upload Image</h3>
                    </div>
                  </div>
                )}

                {showCamera && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                      />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                        <button
                          onClick={capturePhoto}
                          className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:border-blue-500 transition-colors"
                        />
                        <button
                          onClick={stopCamera}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {capturedImage && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Captured Image</h3>
                      <button
                        onClick={() => setCapturedImage(null)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                    <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
                  </div>
                )}
              </div>
            )}

            {/* Generate Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={processing || (inputMethod === 'upload' && uploadedFiles.length === 0) || (inputMethod === 'paste' && !pastedText.trim()) || (inputMethod === 'camera' && !capturedImage)}
                className="bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2L11 7L14 4L12 9H14L10 18L9 13L6 16L8 11H6L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                    Generate {TYPE_LABELS[type]}
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
