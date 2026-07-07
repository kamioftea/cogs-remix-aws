import type { Scenario } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const HoldTheLine: Scenario = {
  name: "Hold the Line",
  setup: renderMarkdown("No additional setup required."),
  scoring: renderMarkdown(`
At the end of the game, divide the area within 6" either side of the centre line into 3, equal 24" long scoring areas.

Add up the unit strengths of each unit that has at least 50% of its base in the area. If a unit ends a move with exactly
50% of its base in each of two of the scoring zones, its controlling player must declare which zone it is in.
If a player has more unit strength in a scoring zone than their opponent, they control that zone.

- If you control the centre area, score three victory points
- For each of the flank areas you control, score two victory points
  `),
  scoreInputs: [
    {
      name: "centre_area",
      label: "Do you control the centre area?",
      type: "boolean",
    },
    {
      name: "flank_areas",
      label: "How many flank areas do you control?",
      type: "number",
      max: 2,
    }
  ],
  tournamentPointFunction(player_inputs): number {
    return (player_inputs.centre_area * 3) + (player_inputs.flank_areas * 2);
  },
};
