'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import AppLayout from '@/components/AppLayout';

const SECTIONS = [
  { href: '/settings/account', label: 'Account' },
  { href: '/settings/notifications', label: 'Notifications' },
  { href: '/settings/appearance', label: 'Appearance' },
  { href: '/settings/progress-data', label: 'Progress & Data' },
  { href: '/settings/billing', label: 'Subscription & Billing' },
  { href: '/settings/privacy-security', label: 'Privacy & Security' },
  { href: '/settings/support', label: 'Help & Support' },
  { href: '/settings/about', label: 'About' },
] as const;

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/login');
      setChecking(false);
    });
  }, [router]);

  if (checking) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 shrink-0 transition-colors duration-300">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account and preferences</p>
        </header>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          <nav className="w-full md:w-52 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-3 overflow-y-auto transition-colors">
            <ul className="flex flex-wrap gap-1 md:flex-col md:space-y-0.5">
              {SECTIONS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gray-50 dark:bg-gray-900 transition-colors min-w-0">
            <div className="max-w-2xl w-full min-w-0">{children}</div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
