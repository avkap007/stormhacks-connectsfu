import { ClubEvents } from "./types";

export const surgeData: Record<string, ClubEvents> = {
  "sfu-surge": {
    upcoming: [
    ],
    past: [
    {
        id: 1,
        title: "Career Discover Panel",
        date: "2025-01-08",
        poster: "/assets/surge/career-discover-panel.png",
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
        title: "Crit Session",
        date: "2025-01-25",
        poster: "/assets/surge/crit-session.png",
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
        title: "Journey Hacks",
        date: "2024-02-02",
        poster: "/assets/surge/journey-hacks.png",
        attendees: [
          { name: "Camille Ng", email: "cna52@sfu.ca", attended: true },
          { name: "Chloe Yip", email: "chloe_yip@sfu.ca", attended: true },
          { name: "Avni Kapoor", email: "avni_kapoor@sfu.ca", attended: true },
          { name: "Jessica Brown", email: "jbrown@sfu.ca", attended: false },
          { name: "Camille Ng", email: "cna52@sfu.ca", attended: true },
          { name: "Chloe Yip", email: "chloe_yip@sfu.ca", attended: true },
          { name: "Avni Kapoor", email: "avni_kapoor@sfu.ca", attended: true },
          { name: "Jessica Brown", email: "jbrown@sfu.ca", attended: false },
          { name: "Camille Ng", email: "cna52@sfu.ca", attended: true },
          { name: "Chloe Yip", email: "chloe_yip@sfu.ca", attended: true },
          { name: "Avni Kapoor", email: "avni_kapoor@sfu.ca", attended: true },
          { name: "Jessica Brown", email: "jbrown@sfu.ca", attended: false },
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
  return surgeData[clubId] || { upcoming: [], past: [] };
}