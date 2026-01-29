import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/my-study-sets', '/flashcards', '/quizzes', '/subjects', '/ai-generator', '/settings'];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const path = request.nextUrl.pathname;
    const isProtected = PROTECTED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

    if (isProtected && !user) {
      const redirect = new URL('/login', request.url);
      redirect.searchParams.set('next', path);
      return NextResponse.redirect(redirect);
    }
  } catch (err) {
    console.error('[middleware] Supabase error:', err);
  }

  return response;
}
