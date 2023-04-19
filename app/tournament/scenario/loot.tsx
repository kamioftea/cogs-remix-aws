import type { Scenario } from "~/tournament/scenario/scenario";
import { unsafeRenderMarkdown } from "~/utils/markdown";

export const Loot: Scenario = {
  name: "Loot",
  setup: unsafeRenderMarkdown(`
Before rolling for sides, place a primary loot token in the centre of the board.

Then each player places one secondary loot token on the centre line, at least 
12" away from other loot counters and 3" away from blocking terrain including 
the ege of the board. Roll off to see who places the first counter.
`),
  scoring: unsafeRenderMarkdown(`
Each player scores the following:

* Score three victory points if they hold the primary loot token at the end
  of the battle.
* Score two victory points for each secondary loot token they hold at the
  end of the battle.
  
The player with the most victory points wins.

Players' tournament points are equal to their victory points.
  `),
  scoreInputs: [
    {
      name: "primary",
      label: "Holds the primary loot counter",
      type: "boolean",
    },
    {
      name: "secondary",
      label: "Number of secondary loot counters held",
      type: "number",
      max: 2,
    },
  ],
  tournamentPointFunction(inputs: Record<string, number>): number {
    return (inputs.primary ?? 0) * 3 + inputs.secondary * 2;
  },
};
