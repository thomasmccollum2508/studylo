'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SettingsAccount() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);
      setEmail(user.email ?? '');
      setName((user.user_metadata?.full_name as string) ?? user.email?.split('@')[0] ?? '');

      const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user.id).single();
      if (profile?.display_name) setName(profile.display_name as string);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    if (!supabase) {
      setSaving(false);
      return;
    }
    const { error } = await supabase.from('profiles').update({ display_name: name || null, updated_at: new Date().toISOString() }).eq('id', userId);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      await supabase.auth.updateUser({ data: { full_name: name } });
      setMessage({ type: 'success', text: 'Saved.' });
    }
    setSaving(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordCurrent.trim()) {
      setMessage({ type: 'error', text: 'Enter your current password.' });
      return;
    }
    if (passwordNew !== passwordConfirm) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordNew.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    if (!supabase) {
      setSaving(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: passwordCurrent });
    if (signInError) {
      setMessage({ type: 'error', text: 'Current password is incorrect.' });
      setSaving(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordNew });
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated.' });
      setShowChangePassword(false);
      setPasswordCurrent('');
      setPasswordNew('');
      setPasswordConfirm('');
    }
    setSaving(false);
  }

  async function handleForgotPassword() {
    if (!email?.trim()) {
      setMessage({ type: 'error', text: 'No email on file. Use the same email you signed up with to request a reset from the login page.' });
      return;
    }
    setMessage(null);
    setForgotPasswordSent(false);
    const supabase = createClient();
    if (!supabase) {
      setMessage({ type: 'error', text: 'Configuration error. Try again later.' });
      return;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/recovery`,
    });
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setForgotPasswordSent(true);
      setMessage({ type: 'success', text: `Check ${email} for a reset link. Click it to set a new password.` });
    }
  }

  function handleDeleteAccount() {
    if (deleteConfirmText !== 'DELETE') return;
    // MVP: direct deletion may require backend or Supabase dashboard; offer contact support.
    setMessage({
      type: 'error',
      text: 'To permanently delete your account, contact support with your email. We’ll process the request within a few days.',
    });
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your name and email.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email is managed by your sign-in provider.</p>
        </div>
        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Change password</h3>
        {forgotPasswordSent && (
          <p className="text-sm text-green-600 dark:text-green-400 mb-2">Check your email and click the link to set a new password.</p>
        )}
        {!showChangePassword ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowChangePassword(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Change password
            </button>
            {email && (
              <>
                <span className="text-gray-400 dark:text-gray-500">·</span>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="mt-2 space-y-3 max-w-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current password</label>
              <input
                type="password"
                value={passwordCurrent}
                onChange={(e) => setPasswordCurrent(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New password</label>
              <input
                type="password"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                placeholder="New password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm new password</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="submit" disabled={saving} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Update password
              </button>
              <button type="button" onClick={() => { setShowChangePassword(false); setMessage(null); setPasswordCurrent(''); setPasswordNew(''); setPasswordConfirm(''); }} className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                Cancel
              </button>
              {email && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div>
        <h3 className="text-base font-medium text-red-600 dark:text-red-400 mb-2">Delete account</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Permanently delete your account and data. This cannot be undone.</p>
        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Delete / deactivate account
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Type <strong>DELETE</strong> to confirm.</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete account
              </button>
              <button type="button" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
