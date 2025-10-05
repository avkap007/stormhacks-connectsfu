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

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required to RSVP' },
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

    // Use the authenticated user's ID
    const { data: rsvp, error } = await supabase
      .from('rsvps')
      .insert({
        event_id: eventId,
        user_id: user.id, // Use real user ID
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

    // Load event details for email context
    const { data: event } = await supabase
      .from('events')
      .select('title, start_at, location_text, campus')
      .eq('id', eventId)
      .single();

    // Send confirmation email using the existing send-email API
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: email,
          subject: `RSVP Confirmed: ${event?.title || 'Your event'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">🎉 RSVP Confirmed!</h2>
              <p>Hi ${name},</p>
              <p>Your RSVP for <strong>${event?.title || 'your event'}</strong> has been confirmed!</p>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Event Details</h3>
                <p><strong>Event:</strong> ${event?.title || 'TBA'}</p>
                <p><strong>Date:</strong> ${event?.start_at ? new Date(event.start_at).toLocaleString() : 'TBA'}</p>
                <p><strong>Location:</strong> ${event?.location_text || 'TBA'}${event?.campus ? `, ${event.campus}` : ''}</p>
                <p><strong>Status:</strong> ${status}</p>
                ${findBuddy ? '<p><strong>Buddy Request:</strong> ✅ You\'re looking for a buddy!</p>' : ''}
              </div>
              
              <p>We'll send you reminders before the event. See you there!</p>
              
              <p>Best regards,<br>ConnectSFU Team</p>
            </div>
          `
        })
      });

      if (!emailResponse.ok) {
        console.error('Failed to send confirmation email');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully! Check your email for confirmation.',
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
