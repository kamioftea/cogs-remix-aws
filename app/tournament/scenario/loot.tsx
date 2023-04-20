import type { Scenario } from "~/tournament/scenario/scenario";
import { unsafeRenderMarkdown } from "~/utils/markdown";

export const Loot: Scenario = {
  name: "Loot",
  setup: unsafeRenderMarkdown(`
Before rolling for sides, place a primary loot token in the
centre of the board.

Then each player places one secondary loot token on the
centre line, at least 12" away from other loot counters
and 3" away from blocking terrain including the edge of
the board. Roll off to see who places the first counter.
`),
  scoring: unsafeRenderMarkdown(`
Players score the following at the end of the battle:

- Score 3 points if they hold the primary loot token.
- Score 2 points for each secondary loot token they hold.
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
