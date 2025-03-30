import type { Scenario } from "~/tournament/scenario/scenario";
import { renderMarkdown } from "~/utils/markdown";

export const CompassPoints: Scenario = {
  name: "Compass Points",
  setup: renderMarkdown(`
Before rolling for sides, place four objective markers to make the four points
of a compass:

- Two objective markers on the centre line, 12" away from each short board 
  edge
- Two objectives markers 9" each side of teh centre line, aligned with the 
  centre of the board.
`),
  scoring: renderMarkdown(`
At the end of the battle, each player scores the objectives they control:

- Score 3 points for the objective marker in their opponent's half 
  of the board.
- Score 2 points for the objective marker in their own half of the 
  board.
- Score 1 point for each of the objectives on the centre line.
  `),
  scoreInputs: [
    {
      name: "opponents_objective",
      label: "Controls their opponent's objective",
      type: "boolean",
    },
    {
      name: "own_objective",
      label: "Controls their own objective",
      type: "boolean",
    },
    {
      name: "centre_objectives",
      label: "Number of centre line objectives controlled",
      type: "number",
      max: 2,
    },
  ],
  tournamentPointFunction(player_inputs): number {
    return (
      (player_inputs.opponents_objective ? 3 : 0) +
      (player_inputs.own_objective ? 2 : 0) +
      player_inputs.centre_objectives
    );
  },
};
