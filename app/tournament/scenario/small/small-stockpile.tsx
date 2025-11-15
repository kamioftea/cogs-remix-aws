import type { Scenario } from "~/tournament/scenario/scenario";
import { unsafeRenderMarkdown } from "~/utils/markdown";

export const SmallStockpile: Scenario = {
  name: "Stockpile",
  setup: unsafeRenderMarkdown(`
Before rolling for sides, place a loot token in the centre of the board.

Then each player places a pile of two loot tokens on the centre line, at least 
12" away from other loot counters and 3" away from blocking terrain including 
the edge of the board. Roll off to see who places the first counter.

A unit may only pick up one loot counter from a pile per turn.
`),
  scoring: unsafeRenderMarkdown(`
At the end of the battle score one point for each objective marker you control.

A unit may not score more points from loot counters than their unit strength.
  `),
  scoreInputs: [
    {
      name: "loot_counters",
      label: "How many loot counters do your units score?",
      type: "number",
      max: 5,
    },
  ],
  tournamentPointFunction(player_inputs): number {
    return player_inputs.loot_counters;
  },
};
