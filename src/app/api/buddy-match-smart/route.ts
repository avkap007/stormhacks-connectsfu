import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Gemini AI matching function
async function getGeminiMatchScore(user1: any, user2: any, event: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Rate the compatibility between two students for attending an event together. Return only a number between 0-100.

Event: ${event.title} - ${event.description}
Event Category: ${event.category}
Event Campus: ${event.campus}

Student 1:
- Bio: ${user1.bio || 'No bio provided'}
- Interests: ${user1.interests?.join(', ') || 'No interests listed'}
- Vibe: ${user1.vibe}
- Gender Preference: ${user1.gender_preference}

Student 2:
- Bio: ${user2.bio || 'No bio provided'}
- Interests: ${user2.interests?.join(', ') || 'No interests listed'}
- Vibe: ${user2.vibe}
- Gender Preference: ${user2.gender_preference}

Consider:
- Shared interests and hobbies
- Compatible vibes (just attend vs explore vs new friend)
- Gender preferences
- Event type and category relevance
- Campus proximity

Return only a compatibility score (0-100):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const scoreText = response.text().trim();
    const score = parseInt(scoreText) || 0;
    
    return Math.max(0, Math.min(100, score)); // Ensure score is between 0-100
  } catch (error) {
    console.error('Gemini API error:', error);
    return 50; // Default neutral score if API fails
  }
}

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

    // Get user profile data for better matching
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('bio, interests')
      .eq('id', user.id)
      .single();

    // Get event details
    const { data: event } = await supabase
      .from('events')
      .select('title, description, category, campus')
      .eq('id', eventId)
      .single();

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

    // If user wants to match now, try to find the best compatible buddy
    if (visibility === 'match_now') {
      // Get all potential buddies with their profile data
      const { data: potentialBuddies, error: searchError } = await supabase
        .from('buddy_requests')
        .select(`
          id,
          user_id,
          nickname,
          gender_preference,
          vibe,
          user_profiles!buddy_requests_user_id_fkey (
            bio,
            interests
          )
        `)
        .eq('event_id', eventId)
        .eq('open', true)
        .neq('user_id', user.id)
        .limit(10);

      if (searchError) {
        console.error('Error searching for buddies:', searchError);
      } else if (potentialBuddies && potentialBuddies.length > 0) {
        // Enhanced matching with Gemini AI
        const currentUser = {
          bio: userProfile?.bio || '',
          interests: userProfile?.interests || [],
          vibe,
          gender_preference: genderPreference
        };

        let bestMatch = null;
        let bestScore = 0;

        // Test compatibility with each potential buddy
        for (const buddy of potentialBuddies) {
          // Basic compatibility checks first
          const basicCompatible = (
            genderPreference === 'open' || 
            buddy.gender_preference === 'open' ||
            genderPreference === buddy.gender_preference
          );

          if (basicCompatible) {
            // Get Gemini AI compatibility score
            const aiScore = await getGeminiMatchScore(
              currentUser, 
              {
                bio: buddy.user_profiles?.bio || '',
                interests: buddy.user_profiles?.interests || [],
                vibe: buddy.vibe,
                gender_preference: buddy.gender_preference
              },
              event
            );

            // Calculate final score with weights
            let finalScore = aiScore;
            
            // Bonus for same vibe
            if (currentUser.vibe === buddy.vibe) {
              finalScore += 10;
            }
            
            // Bonus for shared interests
            const sharedInterests = (currentUser.interests || []).filter(interest => 
              (buddy.interests || []).includes(interest)
            );
            finalScore += sharedInterests.length * 5;

            if (finalScore > bestScore) {
              bestScore = finalScore;
              bestMatch = buddy;
            }
          }
        }

        // If we found a good match (score > 60), create the match
        if (bestMatch && bestScore > 60) {
          const { data: buddyMatch, error: matchError } = await supabase
            .from('buddy_matches')
            .insert({
              event_id: eventId,
              user_a: user.id,
              user_b: bestMatch.user_id,
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
              .eq('id', bestMatch.id);

            // Send notifications to both users
            try {
              await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/buddy-notify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  matchId: buddyMatch.id,
                  eventTitle: event.title,
                  buddyName: bestMatch.nickname
                })
              });
            } catch (notifyError) {
              console.error('Failed to send notifications:', notifyError);
            }

            return NextResponse.json({
              success: true,
              matchFound: true,
              buddy: {
                nickname: bestMatch.nickname,
                vibe: bestMatch.vibe,
                bio: bestMatch.user_profiles?.bio || '',
                interests: bestMatch.user_profiles?.interests || []
              },
              matchId: buddyMatch.id,
              compatibilityScore: bestScore
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
    console.error('Error in smart buddy matching:', error);
    return NextResponse.json(
      { error: 'Failed to process buddy matching' },
      { status: 500 }
    );
  }
}
