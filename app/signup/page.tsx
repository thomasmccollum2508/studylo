'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function SignupPage() {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setLoading(true);
    
    const nameToKeep = name;
    const surnameToKeep = surname;
    const emailToKeep = email;
    
    try {
      const supabase = createClient();
      if (!supabase) {
        setError('Supabase configuration is missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
          data: {
            full_name: `${name.trim()} ${surname.trim()}`.trim(),
            name: name.trim(),
            surname: surname.trim(),
          },
        },
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        setName(nameToKeep);
        setSurname(surnameToKeep);
        setEmail(emailToKeep);
        setPassword('');
        return;
      }
      
      if (data?.user) {
        setSuccess(true);
        setLoading(false);
      } else {
        setError('Signup failed. User was not created. Please try again.');
        setName(nameToKeep);
        setSurname(surnameToKeep);
        setEmail(emailToKeep);
        setPassword('');
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setName(nameToKeep);
      setSurname(surnameToKeep);
      setEmail(emailToKeep);
      setPassword('');
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          <Link href="/" className="flex justify-center mb-8">
            <img src={theme === 'dark' ? "/studylo%20logo%20dark.png" : "/studylo%20logo%202.png"} alt="StudyLo" className="h-12 w-auto transition-opacity duration-300" />
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center transition-colors duration-300">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Check your email</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We sent a confirmation link to <strong className="text-gray-900 dark:text-gray-100">{email}</strong>. Click it to activate your account, then log in.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#0055FF] hover:bg-[#0044CC] text-white font-medium px-6 py-2.5 rounded-[15px] transition-colors"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <img src={theme === 'dark' ? "/studylo%20logo%20dark.png" : "/studylo%20logo%202.png"} alt="StudyLo" className="h-12 w-auto transition-opacity duration-300" />
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create an account</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get started with StudyLo. We&apos;ll send you a confirmation email.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} method="post" action="#" className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="given-name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#0055FF] focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Surname
              </label>
              <input
                id="surname"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                autoComplete="family-name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#0055FF] focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="Your last name"
              />
            </div>
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
                autoComplete="email"
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
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#0055FF] focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0055FF] hover:bg-[#0044CC] disabled:opacity-70 text-white font-medium py-2.5 rounded-[15px] transition-colors"
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0055FF] dark:text-blue-400 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
