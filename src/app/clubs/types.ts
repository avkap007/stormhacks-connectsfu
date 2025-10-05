export type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  rsvps: number;
};

export type PastEvent = {
  id: number;
  title: string;
  date: string;
  poster: string;
  attendees: Array<{ name: string; email: string; attended: boolean }>;
};

export type ClubEvents = {
  upcoming: Event[];
  past: PastEvent[];
};
