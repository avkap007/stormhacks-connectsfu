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

    // For now, let's just store the RSVP directly without user authentication
    // We'll use a simple approach for the demo
    const { data: rsvp, error } = await supabase
      .from('rsvps')
      .insert({
        event_id: eventId,
        user_id: '00000000-0000-0000-0000-000000000000', // Placeholder for demo
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
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating RSVP:', error);
      return NextResponse.json(
        { error: 'Failed to create RSVP: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully! Check your profile for confirmation.',
      rsvp
    });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to create RSVP' },
      { status: 500 }
    );
  }
}
