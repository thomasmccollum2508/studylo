import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** Returns today and yesterday in UTC as YYYY-MM-DD */
function getTodayAndYesterdayUtc(): { today: string; yesterday: string } {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  return { today, yesterday };
}

/**
 * Updates the user's day streak if they haven't been counted today.
 * - If last_streak_date is today: no change.
 * - If last_streak_date is yesterday: increment streak.
 * - Otherwise (null or older): set streak to 1.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Server not configured.' },
        { status: 503 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { today, yesterday } = getTodayAndYesterdayUtc();

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('day_streak, last_streak_date')
      .eq('id', user.id)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found.' },
        { status: 404 }
      );
    }

    const lastDate = profile.last_streak_date
      ? (typeof profile.last_streak_date === 'string'
          ? profile.last_streak_date.slice(0, 10)
          : null)
      : null;

    if (lastDate === today) {
      return NextResponse.json({
        success: true,
        day_streak: profile.day_streak,
        updated: false,
      });
    }

    const currentStreak = typeof profile.day_streak === 'number' ? profile.day_streak : 0;
    const newStreak = lastDate === yesterday ? currentStreak + 1 : 1;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        day_streak: newStreak,
        last_streak_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      day_streak: newStreak,
      updated: true,
    });
  } catch (err) {
    console.error('[update-streak]', err);
    return NextResponse.json(
      { success: false, error: 'Internal error.' },
      { status: 500 }
    );
  }
}
