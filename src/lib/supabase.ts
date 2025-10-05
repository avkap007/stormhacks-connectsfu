import { supabase } from './supabaseClient';

// Database interfaces matching the complete schema
export interface RSVP {
  id?: string;
  event_id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  dietary_restrictions?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  find_buddy: boolean;
  reminder_24h: boolean;
  reminder_2h: boolean;
  status: 'going' | 'interested' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  club_id: string;
  title: string;
  description: string;
  category: string;
  campus: string;
  location_text: string;
  start_at: string;
  end_at: string;
  poster_url?: string;
  created_by: string;
  status: string;
  max_attendees?: number;
  is_free: boolean;
  cost?: number;
  tags: string[];
  created_at: string;
  clubs?: {
    name: string;
    logo_url?: string;
    description: string;
    links?: any;
  };
}

export interface Club {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  links?: any;
  verified: boolean;
  owner_user_ids: string[];
  created_at: string;
}

// Function to create an RSVP record (matches the complete schema)
export async function createRSVP(rsvpData: Omit<RSVP, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('rsvps')
    .insert([rsvpData])
    .select()
    .single();

  if (error) {
    console.error('Error creating RSVP:', error);
    throw error;
  }
  return data;
}

// Function to get events from database
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      clubs (
        name,
        logo_url,
        description
      )
    `)
    .eq('status', 'active')
    .order('start_at', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
  return data || [];
}

// Function to get a single event by ID
export async function getEventById(eventId: string): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      clubs (
        name,
        logo_url,
        description,
        links
      )
    `)
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
  return data;
}

// Function to get user's RSVPs
export async function getUserRSVPs(userId: string) {
  const { data, error } = await supabase
    .from('rsvps')
    .select(`
      *,
      events (
        id,
        title,
        start_at,
        end_at,
        location_text,
        campus,
        clubs (
          name,
          logo_url
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'going')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user RSVPs:', error);
    throw error;
  }
  return data || [];
}

// Function to create a buddy request
export async function createBuddyRequest(eventId: string, userId: string) {
  const { data, error } = await supabase
    .from('buddy_requests')
    .insert([{
      event_id: eventId,
      user_id: userId,
      open: true
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating buddy request:', error);
    throw error;
  }
  return data;
}

export async function sendConfirmationEmail(rsvp: RSVP, eventTitle: string) {
  try {
    // Call our API route to send the email
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: rsvp.email,
        name: rsvp.name,
        eventTitle: eventTitle,
        eventId: rsvp.event_id
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    console.log(`✅ Confirmation email sent to ${rsvp.email} for event "${eventTitle}"`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return { success: false, error };
  }
}
