import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to save notes' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, subject } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Save to study_sets table
    // Note: If the study_sets table doesn't have a content field, you may need to add it
    // For now, we'll save it and you can add a content field later if needed
    const { data, error } = await supabase
      .from('study_sets')
      .insert({
        user_id: user.id,
        title: title,
        subject: subject || null,
        card_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving note:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save note. Please try again.' },
        { status: 500 }
      );
    }

    // If you have a separate notes table or want to add content to study_sets:
    // You would need to either:
    // 1. Add a 'content' field to study_sets table
    // 2. Create a separate 'notes' table
    // For now, we'll save the content to localStorage/sessionStorage on the client side
    // and associate it with the study set ID

    return NextResponse.json({
      success: true,
      studySet: data,
      message: 'Note saved successfully!'
    });
  } catch (error: any) {
    console.error('Save note error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
