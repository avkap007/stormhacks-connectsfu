import { NextResponse } from 'next/server';
import { createRSVP } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: request.headers.get('authorization') || '',
          },
        },
      }
    );
    
    // Get the current user from the authorization header
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in first' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      eventId, 
      name, 
      email, 
      phone, 
      dietaryRestrictions, 
      emergencyContact, 
      emergencyPhone, 
      findBuddy, 
      reminder24h, 
      reminder2h, 
      status = 'going' 
    } = body;

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: 'Event ID, name, and email are required' },
        { status: 400 }
      );
    }

    const rsvp = await createRSVP({
      event_id: eventId,
      user_id: user.id,
      name,
      email,
      phone,
      dietary_restrictions: dietaryRestrictions,
      emergency_contact: emergencyContact,
      emergency_phone: emergencyPhone,
      find_buddy: findBuddy || false,
      reminder_24h: reminder24h || false,
      reminder_2h: reminder2h || false,
      status
    });
    return NextResponse.json(rsvp);
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to create RSVP' },
      { status: 500 }
    );
  }
}
