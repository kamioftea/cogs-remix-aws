import type { Scenario } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const GoldRush: Scenario = {
  name: "Gold Rush",
  setup: renderMarkdown(`
Before rolling for sides, place one loot counter in the centre of the board.
Then players alternate placing loot counters on the board until they have 
both placed three markers. The winner of a roll-off places the first counter. 
Loot counters must be at least 12" from other markers, and 3" from blocking 
terrain including the board edges.
`),
  scoring: renderMarkdown(`
At the end of the battle each player scores one point for each loot counter 
carried by one of their units. 

_A unit can carry any number of loot counters, 
but may not score more loot counters than their unit strength._ 
  `),
  scoreInputs: [
    {
      name: "loot_counters",
      label: "Number of loot counters scored",
      type: "number",
      max: 7,
    },
  ],
  tournamentPointFunction(player_inputs): number {
    return player_inputs.loot_counters;
  },
};
