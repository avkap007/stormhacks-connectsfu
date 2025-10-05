"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

interface UserProfileData {
  name: string;
  email: string;
  phone?: string;
  dietary_restrictions?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  bio?: string;
  interests?: string[];
  created_at: string;
}

interface UserEvent {
  id: string;
  title: string;
  start_at: string;
  end_at?: string;
  campus?: string;
  location?: string;
  club?: string;
  status: string;
  find_buddy: boolean;
  rsvp_date?: string;
}

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    interests: '',
    phone: '',
    dietary_restrictions: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load user's RSVPs to get their events
      const { data: rsvps, error: rsvpError } = await supabase
        .from('rsvps')
        .select(`
          id,
          status,
          find_buddy,
          created_at,
          events (
            id,
            title,
            start_at,
            end_at,
            location_text,
            campus,
            clubs (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (rsvpError) {
        console.error('Error loading user RSVPs:', rsvpError);
      } else {
        const events = rsvps?.map((rsvp: any) => {
          const ev = Array.isArray(rsvp.events) ? rsvp.events[0] : rsvp.events;
          return {
            id: ev?.id,
            title: ev?.title,
            start_at: ev?.start_at,
            end_at: ev?.end_at,
            location: ev?.location_text,
            campus: ev?.campus,
            club: ev?.clubs?.[0]?.name ?? ev?.clubs?.name,
            status: rsvp.status,
            find_buddy: rsvp.find_buddy,
            rsvp_date: rsvp.created_at
          } as any;
        }) || [];
        setUserEvents(events);
      }

      // Prefer server-side user_profiles (buddy engine source of truth)
      const { data: profileRow } = await supabase
        .from('user_profiles')
        .select('name, bio, interests, phone, dietary_restrictions, emergency_contact, emergency_phone, created_at')
        .eq('id', user.id)
        .single();

      const meta = user.user_metadata || {} as any;
      const merged = {
        name: profileRow?.name || meta.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        bio: profileRow?.bio ?? meta.bio ?? '',
        interests: (profileRow?.interests ?? meta.interests ?? []) as string[],
        phone: profileRow?.phone ?? meta.phone ?? '',
        dietary_restrictions: profileRow?.dietary_restrictions ?? meta.dietary_restrictions ?? '',
        emergency_contact: profileRow?.emergency_contact ?? meta.emergency_contact ?? '',
        emergency_phone: profileRow?.emergency_phone ?? meta.emergency_phone ?? '',
        created_at: user.created_at
      } as UserProfileData & { email: string };

      setProfile(merged);

      setFormData({
        bio: merged.bio || '',
        interests: (merged.interests || []).join(', '),
        phone: merged.phone || '',
        dietary_restrictions: merged.dietary_restrictions || '',
        emergency_contact: merged.emergency_contact || '',
        emergency_phone: merged.emergency_phone || ''
      });

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const interests = formData.interests.split(',').map(i => i.trim()).filter(i => i);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          bio: formData.bio,
          interests: interests,
          phone: formData.phone,
          dietary_restrictions: formData.dietary_restrictions,
          emergency_contact: formData.emergency_contact,
          emergency_phone: formData.emergency_phone
        }
      });

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        // ALSO persist to user_profiles (used by buddy matching)
        const { error: upsertErr } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            bio: formData.bio || null,
            interests: interests.length > 0 ? interests : null,
            phone: formData.phone || null,
            dietary_restrictions: formData.dietary_restrictions || null,
            emergency_contact: formData.emergency_contact || null,
            emergency_phone: formData.emergency_phone || null
          }, { onConflict: 'id' });
        if (upsertErr) {
          console.error('Error upserting user_profiles:', upsertErr);
        }

        setEditing(false);
        loadUserData(); // Reload data
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chinese-blue"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200/60 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-chinese-blue to-ceil grid place-items-center text-white text-2xl font-bold border">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-chinese-blue text-white rounded-lg hover:bg-ceil transition-colors"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {profile.bio && (
          <p className="text-chinese-blue mb-4">{profile.bio}</p>
        )}

        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-chinese-blue/10 text-chinese-blue border border-chinese-blue/20"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Profile Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200/60 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests (comma-separated)
              </label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50"
                placeholder="Technology, Sports, Music..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  value={formData.dietary_restrictions}
                  onChange={(e) => setFormData({...formData, dietary_restrictions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-blue/50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-chinese-blue text-white rounded-lg hover:bg-ceil transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages entry point */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200/60 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
        <p className="text-gray-600 mb-4">Your buddy matches and conversations.</p>
        <a href="/messages" className="px-4 py-2 bg-chinese-blue text-white rounded-lg hover:bg-ceil transition-colors text-sm font-medium">Open messages</a>
      </motion.div>

      {/* User Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200/60 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Events</h2>
        {userEvents.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            You haven't RSVP'd to any events yet. 
            <br />
            <span className="text-chinese-blue">Explore events to get started!</span>
          </p>
        ) : (
          <div className="space-y-4">
            {userEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📅 {formatDate(event.start_at)}</p>
                      <p>📍 {event.location}, {event.campus}</p>
                      {event.club && <p>🏢 {event.club}</p>}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {event.find_buddy && (
                        <span className="inline-block px-2 py-1 bg-pearly-purple/20 text-pearly-purple text-xs rounded-full">
                          Looking for buddy
                        </span>
                      )}
                      {event.rsvp_date && (
                        <span className="text-xs text-gray-500">
                          RSVP'd on {new Date(event.rsvp_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === 'going' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
