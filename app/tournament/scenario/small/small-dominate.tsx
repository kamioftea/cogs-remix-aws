import type { Scenario } from "~/tournament/scenario/scenario";
import { normaliseSmallScore } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const SmallDominate: Scenario = {
  name: "Dominate",
  setup: renderMarkdown("No additional setup required."),
  scoring: renderMarkdown(`
At the end of the battle add up the unit strength of each unit where the
majority of its base is within 12" of the center of the board. 

If the combined total of both players’ scoring unit strength is 5 or less, they
each score their total scoring unit strength as tournament points. If the 
combined total is 6 or more, use the first of the following that applies.

- If the players draw, they both score 2 tournament points. 
- If the losing player’s unit strength total is zero, the players score 5 – 0. 
- If the losing player’s unit strength total is less than one-half of the 
  winner’s, the players score 4 – 1. 
- Otherwise, the players score 3 – 2. 
  `),
  scoreInputs: [
    {
      name: "unit_strength",
      label:
        "How much unit strength do you have where the " +
        'majority of its base is within 12" of the center of the board?',
      type: "number",
    },
  ],
  tournamentPointFunction(player_inputs, opponent_inputs): number {
    const player_us = player_inputs["unit_strength"] ?? 0;
    const opponent_us = opponent_inputs["unit_strength"] ?? 0;
    return normaliseSmallScore(player_us, opponent_us);
  },
};
