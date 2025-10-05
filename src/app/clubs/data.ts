import { ClubEvents } from "./types";
import { gdscData } from "./gdsc_data";
import { surgeData } from "./surge_data";

export const clubEventsData: Record<string, ClubEvents> = {
  "google-developer-student-club---sfu": gdscData["google-developer-student-club---sfu"],
  "sfu-surge": surgeData["sfu-surge"],
};
