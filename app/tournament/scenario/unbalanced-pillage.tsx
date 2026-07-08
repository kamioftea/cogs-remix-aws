import type { Scenario } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const UnbalancedPillage: Scenario = {
  name: "Pillage",
  setup: renderMarkdown(`
Before rolling for sides players alternate placing objective markers until there are a total of seven markers on the
board. The winner of a roll-off places the first marker. Objective markers must be at least 12" from other markers, and
3" from blocking terrain including the board edges.
  `),
  scoring: renderMarkdown(`
At the end of the battle score one point for each objective marker you control.
  `),
  scoreInputs: [
    {
      name: "objectives",
      label: "How many objective markers do you control?",
      type: "number",
      max: 7,
    },
  ],
  tournamentPointFunction(player_inputs): number {
    return player_inputs.objectives;
  },
};
