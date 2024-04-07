import type { Scenario } from "~/tournament/scenario/scenario";
import { normaliseScore } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const Control: Scenario = {
  name: "Control",
  setup: renderMarkdown("No additional setup required."),
  scoring: renderMarkdown(`
At the end of the battle divide the board into six, 24" square scoring zones, 
three each side of the centre line. For each of these, if one player has more 
unit strength within the square, they control it. If a unit is in multiple zones
it counts as being in the zone with the largest proportion of its base. At the
end of any move, if the unit is equally in two or more zones, its controlling 
player must declare which zone it is in.

- Score two points if you control the central zone in your opponent's half of 
  the board.
- Score one point for each other zone you control. 
  `),
  scoreInputs: [
    {
      name: "primary_zone",
      label: "Do you control the central zone in your opponent's half of the board?",
      type: "boolean",
    },
    {
      name: "other_zones",
      label: "How many other zones do you control?",
      type: "number",
      max: 5
    }
  ],
  tournamentPointFunction(player_inputs): number {
    return (player_inputs.primary_zone ? 2 : 0) + player_inputs.other_zones
  },
};
