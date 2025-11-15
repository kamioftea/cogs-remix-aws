import type { Scenario } from "~/tournament/scenario/scenario";
import { unsafeRenderMarkdown } from "~/utils/markdown";

export const SmallFoolsGold: Scenario = {
  name: "Fool's Gold",
  setup: unsafeRenderMarkdown(`
After rolling to choose sides, place an objective in the centre of the board.

Then each player takes it in turn to place three bluff counters anywhere on 
their opponents half of the board. These can be either:
- Two one-point bluff counters, and a zero-point bluff counter, or
- One two-point bluff counter, and two zero-point bluff counters.

Bluff counters should be placed as objectives, 12" from any other objective 
marker and 3" from blocking terrain, including the board edge.

At the end of the third round, turn all of the bluff counters face up.
`),
  scoring: unsafeRenderMarkdown(`
Players score the following at the end of the battle:

- Score 2 victory points for each two-point bluff counter they control.
- Score 1 victory point for each one-point bluff counter they control.
- Score one victory point if they control the central objective.
  `),
  scoreInputs: [
    {
      name: "objective",
      label: "Controls the central objective",
      type: "boolean",
    },
    {
      name: "two_point",
      label: "Number of two-point bluff counters",
      type: "number",
      max: 2,
    },
    {
      name: "one_point",
      label: "Number of one-point bluff counters",
      type: "number",
      max: 4,
    },
  ],
  tournamentPointFunction(inputs: Record<string, number>): number {
    return (inputs.objective ?? 0) + inputs.two_point * 2 + inputs.one_point;
  },
};
