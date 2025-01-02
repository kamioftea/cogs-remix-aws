import type { Scenario } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const Plunder: Scenario = {
  name: "Plunder",
  setup: renderMarkdown(`
Before rolling for sides, place five loot counters on the centre line of the 
board. One in the exact centre, two each side of that 12" away, and two more 12"
away from them.

After rolling off to choose sides each player nominates a different counter to 
be a primary loot counter, starting with the player who chose sides.
  `),
  scoring: renderMarkdown(`
Players score the following at the end of the battle:
- Score two points for each primary loot counter your units hold.
- Score one point for each other loot counter your units hold.
  `),
  scoreInputs: [
    {
      name: "primary_loot_counters",
      label: "How many primary loot counters do your units hold?",
      type: "number",
      max: 2,
    },
    {
      name: "other_loot_counters",
      label: "How many other loot counters do your units hold?",
      type: "number",
      max: 3,
    },
  ],
  tournamentPointFunction(player_inputs): number {
    return (
      player_inputs.primary_loot_counters * 2 +
      player_inputs.other_loot_counters
    );
  },
};
