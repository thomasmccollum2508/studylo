'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0f172a', color: '#e2e8f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>
            If you just set up the app, make sure you have a <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: 4 }}>.env.local</code> file with <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_URL</code> and <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (see <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: 4 }}>.env.example</code>).
          </p>
          {reset && (
            <button
              onClick={() => reset()}
              style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}
            >
              Try again
            </button>
          )}
          {!reset && (
            <a
              href="/"
              style={{ display: 'inline-block', background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 16, textDecoration: 'none' }}
            >
              Go to Home
            </a>
          )}
        </div>
      </body>
    </html>
  );
}
