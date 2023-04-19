export interface Scenario {
  name: string;
  setup: string;
  scoring: string;
  scoreInputs: ScoreInput[];
  tournamentPointFunction: (
    player_inputs: Record<string, number>,
    opponent_inputs: Record<string, number>
  ) => number;
}

interface ScoreInput {
  name: string;
  label: string;
  type: "number" | "boolean";
  max?: number;
}

export function normaliseScore(player_score: number, opponent_score: number) {
  const total_score = player_score + opponent_score;
  if (total_score <= 7) {
    return player_score;
  }

  if (player_score === opponent_score) return 3;
  const [max, min, score_index] =
    player_score > opponent_score
      ? [player_score, opponent_score, 0]
      : [opponent_score, player_score, 1];

  if (min === 0) return [7, 0][score_index];
  if (min < max / 3) return [6, 1][score_index];
  if (min < (max * 2) / 3) return [5, 2][score_index];
  return [4, 3][score_index];
}
