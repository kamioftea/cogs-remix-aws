import FormCheckbox from "~/form/checkbox";
import React from "react";
import FormInput from "~/form/input";

export interface Scenario {
  name: string;
  setup: string;
  scoring: string;
  scoreInputs: ScoreInput[];
  tournamentPointFunction: (
    player_inputs: Record<string, number>,
    opponent_inputs: Record<string, number>,
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

export function normaliseSmallScore(
  player_score: number,
  opponent_score: number,
) {
  const total_score = player_score + opponent_score;
  if (total_score <= 5) {
    return player_score;
  }

  if (player_score === opponent_score) return 2;
  const [max, min, score_index] =
    player_score > opponent_score
      ? [player_score, opponent_score, 0]
      : [opponent_score, player_score, 1];

  if (min === 0) return [5, 0][score_index];
  if (min < max / 2) return [4, 1][score_index];
  return [3, 2][score_index];
}

interface ScoreInputFieldProps {
  scoreInput: ScoreInput;
  value: number | undefined;
  label?: boolean;
}

export const ScoreInputField = ({
  scoreInput,
  value,
  label = false,
}: ScoreInputFieldProps) => {
  switch (scoreInput.type) {
    case "boolean":
      return (
        <FormCheckbox
          label={label ? scoreInput.label : ""}
          name={scoreInput.name}
          checkedValue={1}
          uncheckedValue={0}
          defaultChecked={value === 1}
        />
      );

    case "number":
      return (
        <FormInput
          label={label ? scoreInput.label : ""}
          type="number"
          name={scoreInput.name}
          defaultValue={value?.toString() ?? ""}
          {...{ max: scoreInput.max }}
        />
      );
  }
};

export const ScoreInputValue = ({
  scoreInput,
  value,
}: ScoreInputFieldProps) => {
  switch (scoreInput.type) {
    case "boolean":
      return <>{value == null ? "-" : value ? "Yes" : "No"}</>;
    case "number":
      return <>{value == null ? "-" : value}</>;
  }
};
