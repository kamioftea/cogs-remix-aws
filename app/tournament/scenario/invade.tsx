import type { Scenario } from "~/tournament/scenario/scenario";
import { normaliseScore } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const Invade: Scenario = {
  name: "Invade",
  setup: renderMarkdown("No additional setup required."),
  scoring: renderMarkdown(`
At the end of the battle players add up the total unit strength of units with 
the majority of their footprint on their opponent's half of the board. The 
player with the highest total wins.

If the combined total of both players' scoring unit strength is 7 or less, they
each score their total scoring unit strength as tournament points. If the 
combined total is 8 or more, use the first of the following that applies.

* If the players draw, they both score 3 tournament points.
* If the losing player's unit strength total is zero, the winning player scores 
  7 and the losing player scores 0.
* If the losing player's player's unit strength total is less than one-third of 
  the winning player's total, the winning player scores 6 and the losing player
  scores 1.
* If the losing player's player's unit strength total is less than two-thirds of 
  the winning player's total, the winning player scores 5 and the losing player
  scores 2.
* Otherwise, the winning player scores 4 and the losing player scores 3.
  `),
  scoreInputs: [
    {
      name: "unit_strength",
      label: "Total unit strength with majority in opponent's half",
      type: "number",
    },
  ],
  tournamentPointFunction(player_inputs, opponent_updates): number {
    const player_us = player_inputs["unit_strength"] ?? 0;
    const opponent_us = opponent_updates["unit_strength"] ?? 0;
    return normaliseScore(player_us, opponent_us);
  },
};
