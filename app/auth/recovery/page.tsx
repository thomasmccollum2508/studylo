'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthRecoveryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const supabase = createClient();
    if (!supabase) {
      setHasSession(false);
      return;
    }
    function checkSession() {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setHasSession(true);
          return;
        }
        const hasHash = typeof window !== 'undefined' && window.location.hash?.includes('type=recovery');
        if (hasHash) {
          setTimeout(checkSession, 300);
        } else {
          setHasSession(false);
        }
      });
    }
    checkSession();
  }, [mounted]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    if (!supabase) {
      setMessage({ type: 'error', text: 'Configuration error.' });
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
      return;
    }
    setMessage({ type: 'success', text: 'Password updated. Redirecting…' });
    setTimeout(() => router.push('/settings/account'), 1500);
    setLoading(false);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-gray-500 dark:text-gray-400">Loading…</div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Invalid or expired link</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This password reset link is invalid or has expired. Request a new one from Settings → Change password → Forgot password?
          </p>
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Set new password</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Enter your new password below.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {message.text}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? 'Updating…' : 'Set new password'}
            </button>
          </form>
          <p className="mt-4 text-center">
            <Link href="/settings/account" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Back to settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
