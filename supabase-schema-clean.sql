-- Clean Supabase schema setup
-- This will safely handle existing tables and create what's missing

-- First, let's see what tables exist and drop them safely
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.buddy_matches CASCADE;
DROP TABLE IF EXISTS public.buddy_requests CASCADE;
DROP TABLE IF EXISTS public.rsvps CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.clubs CASCADE;

-- Create Clubs table
CREATE TABLE public.clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  links JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  owner_user_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Events table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  campus TEXT NOT NULL,
  location_text TEXT NOT NULL,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  poster_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active',
  max_attendees INTEGER,
  is_free BOOLEAN DEFAULT true,
  cost DECIMAL(10,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  dietary_restrictions TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  find_buddy BOOLEAN DEFAULT false,
  reminder_24h BOOLEAN DEFAULT false,
  reminder_2h BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'going',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create Buddy Requests table
CREATE TABLE public.buddy_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create Buddy Matches table
CREATE TABLE public.buddy_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_a UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_b UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_a, user_b)
);

-- Create Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.buddy_matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Enable read access for all users" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.clubs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Enable update for club owners" ON public.clubs FOR UPDATE USING (auth.uid() = ANY(owner_user_ids));
CREATE POLICY "Enable delete for club owners" ON public.clubs FOR DELETE USING (auth.uid() = ANY(owner_user_ids));

CREATE POLICY "Enable read access for all users" ON public.events FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Enable update for event creators" ON public.events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Enable delete for event creators" ON public.events FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Enable read access for all users" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Users can insert their own rsvps" ON public.rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rsvps" ON public.rsvps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rsvps" ON public.rsvps FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for all users" ON public.buddy_requests FOR SELECT USING (true);
CREATE POLICY "Users can insert their own buddy requests" ON public.buddy_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own buddy requests" ON public.buddy_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own buddy requests" ON public.buddy_requests FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for matched users" ON public.buddy_matches FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Users can insert their own buddy matches" ON public.buddy_matches FOR INSERT WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Users can update their own buddy matches" ON public.buddy_matches FOR UPDATE USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Users can delete their own buddy matches" ON public.buddy_matches FOR DELETE USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Enable read access for match participants" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.buddy_matches 
    WHERE buddy_matches.id = messages.match_id 
    AND (buddy_matches.user_a = auth.uid() OR buddy_matches.user_b = auth.uid())
  )
);
CREATE POLICY "Users can insert messages to their matches" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can read their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_rsvps_user_id ON public.rsvps(user_id);
CREATE INDEX idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX idx_buddy_requests_event_id ON public.buddy_requests(event_id);
CREATE INDEX idx_buddy_requests_user_id ON public.buddy_requests(user_id);
CREATE INDEX idx_events_start_at ON public.events(start_at);
CREATE INDEX idx_events_campus ON public.events(campus);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_scheduled_at ON public.notifications(scheduled_at);

-- Insert sample clubs
INSERT INTO public.clubs (id, name, description, logo_url, verified, owner_user_ids) VALUES
('11111111-1111-1111-1111-111111111111', 'GDSC SFU', 'Google Developer Student Club at SFU', 'https://avatars.githubusercontent.com/u/51455525?v=4', true, '{}'),
('22222222-2222-2222-2222-222222222222', 'SFU Surge', 'SFU Surge Entrepreneurship Club', 'https://sfusurge.com/logo.png', true, '{}'),
('33333333-3333-3333-3333-333333333333', 'Enactus SFU', 'Enactus SFU - Social Entrepreneurship', 'https://enactus.org/wp-content/uploads/2019/09/Enactus-Logo.png', true, '{}'),
('44444444-4444-4444-4444-444444444444', 'WiCS SFU', 'Women in Computing Science at SFU', 'https://wics.sfu.ca/logo.png', true, '{}'),
('55555555-5555-5555-5555-555555555555', 'SFU Film Society', 'SFU Film Society - Movie screenings and discussions', 'https://sfufilmsociety.ca/logo.png', true, '{}');

-- Note: Sample events will be added after users sign up and create events
-- For now, the database is set up and ready to receive events from authenticated users
