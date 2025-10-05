import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const body = await request.json();
    const { 
      eventId,
      nickname,
      genderPreference,
      vibe,
      visibility
    } = body;

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract the token and verify the user
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user already has a buddy request for this event
    const { data: existingRequest } = await supabase
      .from('buddy_requests')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a buddy request for this event' },
        { status: 400 }
      );
    }

    // Create buddy request
    const { data: buddyRequest, error: requestError } = await supabase
      .from('buddy_requests')
      .insert({
        event_id: eventId,
        user_id: user.id,
        nickname,
        gender_preference: genderPreference,
        vibe,
        visibility,
        open: visibility === 'match_now'
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating buddy request:', requestError);
      return NextResponse.json(
        { error: 'Failed to create buddy request: ' + requestError.message },
        { status: 500 }
      );
    }

    // If user wants to match now, try to find a compatible buddy
    if (visibility === 'match_now') {
      const { data: potentialBuddies, error: searchError } = await supabase
        .from('buddy_requests')
        .select(`
          id,
          user_id,
          nickname,
          gender_preference,
          vibe,
          users!buddy_requests_user_id_fkey (
            id,
            email
          )
        `)
        .eq('event_id', eventId)
        .eq('open', true)
        .neq('user_id', user.id)
        .limit(5);

      if (searchError) {
        console.error('Error searching for buddies:', searchError);
      } else if (potentialBuddies && potentialBuddies.length > 0) {
        // Simple matching logic - find first compatible buddy
        const compatibleBuddy = potentialBuddies.find(buddy => {
          // Check gender preference compatibility
          if (genderPreference === 'same_gender' && buddy.gender_preference === 'same_gender') {
            return true; // Both want same gender - would need actual gender data
          }
          if (genderPreference === 'open' || buddy.gender_preference === 'open') {
            return true; // At least one is open
          }
          return false;
        });

        if (compatibleBuddy) {
          // Create buddy match
          const { data: buddyMatch, error: matchError } = await supabase
            .from('buddy_matches')
            .insert({
              event_id: eventId,
              user_a: user.id,
              user_b: compatibleBuddy.user_id,
              status: 'pending'
            })
            .select()
            .single();

          if (matchError) {
            console.error('Error creating buddy match:', matchError);
          } else {
            // Close both buddy requests
            await supabase
              .from('buddy_requests')
              .update({ open: false })
              .eq('id', buddyRequest.id);

            await supabase
              .from('buddy_requests')
              .update({ open: false })
              .eq('id', compatibleBuddy.id);

            return NextResponse.json({
              success: true,
              matchFound: true,
              buddy: {
                nickname: compatibleBuddy.nickname,
                vibe: compatibleBuddy.vibe
              },
              matchId: buddyMatch.id
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      matchFound: false,
      message: 'Buddy request created. We\'ll notify you when someone\'s looking too!'
    });

  } catch (error) {
    console.error('Error in buddy matching:', error);
    return NextResponse.json(
      { error: 'Failed to process buddy matching' },
      { status: 500 }
    );
  }
}
