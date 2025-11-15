import type { Scenario } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const SmallControl: Scenario = {
  name: "Control",
  setup: renderMarkdown("No additional setup required."),
  scoring: renderMarkdown(`
At the end of the battle quarter the board into four 24" square scoring zones. 
For each of these, if one player has more unit strength within the square, they
control it. If a unit is in multiple zones it counts as being in the zone with 
the largest proportion of its base. 

_At the end of any move, if the moving unit is equally in two or more zones, its 
controlling player must declare which zone it is in._

- Score two points if you control the left-hand zone on your opponent's half of 
  the board.
- Score one point for each other zone you control.

If players draw at 3 points each, they score 2 tournament points each.
  `),
  scoreInputs: [
    {
      name: "primary_zone",
      label:
        "Do you control the left-hand zone on your opponent's half of the board?",
      type: "boolean",
    },
    {
      name: "other_zones",
      label: "How many other zones do you control?",
      type: "number",
      max: 3,
    },
  ],
  tournamentPointFunction(player_inputs): number {
    return (player_inputs.primary_zone ? 2 : 0) + player_inputs.other_zones;
  },
};
