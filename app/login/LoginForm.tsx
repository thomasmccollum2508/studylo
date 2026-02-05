'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const authError = searchParams.get('error') === 'auth';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setLoading(true);
    
    const emailToKeep = email;
    
    try {
      const supabase = createClient();
      if (!supabase) {
        setError('Supabase configuration is missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        setEmail(emailToKeep);
        setPassword('');
        return;
      }
      
      if (data?.session) {
        const next = searchParams.get('next') ?? '/dashboard';
        // Full page navigation so the next request includes auth cookies (fixes redirect after login)
        window.location.href = next;
        return;
      } else {
        setError('Login failed. No session created.');
        setEmail(emailToKeep);
        setPassword('');
        setLoading(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      const isNetworkError =
        message === 'Failed to fetch' ||
        message.toLowerCase().includes('network') ||
        message.toLowerCase().includes('load failed');
      setError(
        isNetworkError
          ? 'Cannot reach the auth server. Check your internet connection. If you use Supabase, ensure your project is not paused and NEXT_PUBLIC_SUPABASE_URL is correct.'
          : message
      );
      setEmail(emailToKeep);
      setPassword('');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <img src={theme === 'dark' ? "/studylo%20logo%20dark.png" : "/studylo%20logo%202.png"} alt="StudyLo" className="h-12 w-auto transition-opacity duration-300" />
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Log in</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Welcome back. Sign in to continue.</p>

          {(error || authError) && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
              {authError ? 'Authentication failed. Please try again.' : error}
            </div>
          )}

          <form onSubmit={handleSubmit} method="post" action="#" className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#0055FF] focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#0055FF] focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-70 text-white font-medium py-2.5 rounded-[15px] transition-colors"
            >
              {loading ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#0055FF] dark:text-blue-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
