import { ClubEvents } from "./types";

export const gdscData: Record<string, ClubEvents> = {
  "google-developer-student-club---sfu": {
    upcoming: [
      {
        id: 1,
        title: "Clubs Day",
        date: "2026-01-08",
        time: "11:00",
        location: "Convocation Mall (Burnaby Campus)",
        description: "Join us at SFU Clubs Day and see what GDSC SFU is all about. Drop by our booth to ask questions and connect with fellow tech enthusiasts!",
        capacity: 60,
        rsvps: 45,
      },
      {
        id: 2,
        title: "Google Cloud Platform Deep Dive",
        date: "2025-10-25",
        time: "18:30",
        location: "TASC 1 9204",
        description: "Explore GCP services including Compute Engine, Cloud Storage, and Cloud Functions.",
        capacity: 40,
        rsvps: 32,
      }
    ],
    past: [
    {
        id: 1,
        title: "Visit GDSC @ Clubs Day",
        date: "2025-09-11",
        poster: "/assets/gdsc/clubs-day.png",
        attendees: [
        { name: "Camille Ng", email: "cna52@sfu.ca", attended: true },
        { name: "Chloe Yip", email: "chloe_yip@sfu.ca", attended: true },
        { name: "Emily Trinh", email: "eta61@sfu.ca", attended: false },
        { name: "Sarah Chen", email: "schen@sfu.ca", attended: true },
        { name: "Michael Rodriguez", email: "mrodriguez@sfu.ca", attended: true },
        { name: "James Park", email: "jpark@sfu.ca", attended: false },
        { name: "Olivia Thompson", email: "othompson@sfu.ca", attended: true },
        { name: "David Kim", email: "dkim@sfu.ca", attended: true },
        ]
    },
      {
        id: 2,
        title: "Resume & Portfolio Review Workshop",
        date: "2025-07-18",
        poster: "/assets/gdsc/resume-review.png",
        attendees: [
          { name: "Camille Ng", email: "cna52@sfu.ca", attended: true },
          { name: "Chloe Yip", email: "chloe_yip@sfu.ca", attended: true },
          { name: "Avni Kapoor", email: "avni_kapoor@sfu.ca", attended: true },
          { name: "Emily Trinh", email: "eta61@sfu.ca", attended: false },
          { name: "Alex Johnson", email: "ajohnson@sfu.ca", attended: false },
          { name: "Sophia Martinez", email: "smartinez@sfu.ca", attended: false },
          { name: "Ryan Lee", email: "rlee@sfu.ca", attended: true },
          { name: "Jessica Brown", email: "jbrown@sfu.ca", attended: false },
        ]
      },
      {
        id: 3,
        title: "Hack the Sem Demo Day",
        date: "2025-04-08",
        poster: "/assets/gdsc/hack-sem.png",
        attendees: [
          { name: "Camille Ng", email: "cna52@sfu.ca", attended: true },
          { name: "Chloe Yip", email: "chloe_yip@sfu.ca", attended: true },
          { name: "Avni Kapoor", email: "avni_kapoor@sfu.ca", attended: true },
          { name: "Jessica Brown", email: "jbrown@sfu.ca", attended: false },
        ]
      }
    ]
  },
};

export function getClubEvents(clubId: string): ClubEvents {
  return gdscData[clubId] || { upcoming: [], past: [] };
}