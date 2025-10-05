import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const body = await request.json();
    const { matchId, eventTitle, buddyName } = body;

    // Get the match details
    const { data: match, error: matchError } = await supabase
      .from('buddy_matches')
      .select(`
        id,
        user_a,
        user_b,
        compatibility_score,
        events (
          title
        )
      `)
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    // Create notifications for both users
    const notifications = [
      {
        type: 'buddy_match',
        user_id: match.user_a,
        event_id: match.event_id,
        title: '🎉 You\'ve got a buddy!',
        message: `You've been matched with ${buddyName} for ${eventTitle}! Start chatting to coordinate.`,
        scheduled_at: new Date().toISOString()
      },
      {
        type: 'buddy_match',
        user_id: match.user_b,
        event_id: match.event_id,
        title: '🎉 You\'ve got a buddy!',
        message: `You've been matched with ${buddyName} for ${eventTitle}! Start chatting to coordinate.`,
        scheduled_at: new Date().toISOString()
      }
    ];

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (notificationError) {
      console.error('Error creating notifications:', notificationError);
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications sent successfully'
    });

  } catch (error) {
    console.error('Error in buddy notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
