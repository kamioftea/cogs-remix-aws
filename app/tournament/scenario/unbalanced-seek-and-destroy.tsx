import type { Scenario } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const UnbalancedSeekAndDestroy: Scenario = {
  name: "Seek and destroy",
  setup: renderMarkdown(`
Before rolling for sides players alternate placing loot counters until there are a total of seven counters on the board.
The winner of a roll-off places the first counter. Loot counters must be at least 12" from other markers, and 3" from
blocking terrain including the board edges.

If a unit Routs an enemy unit that is carrying Loot in melee, they may elect to destroy the Loot and remove it from the
table rather than picking it up.
  `),
  scoring: renderMarkdown(`
Each unit may only score loot tokens upto its unit strength. Each player scores one victory point for each scoring loot
token their units hold.
  `),
  scoreInputs: [
    {
      name: "loot_counters",
      label: "How many loot counters do your units score?",
      type: "number",
      max: 7,
    }
  ],
  tournamentPointFunction(player_inputs): number {
    return (player_inputs.loot_counters);
  },
};
