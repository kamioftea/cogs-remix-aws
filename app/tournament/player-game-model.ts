import { PlayerGame } from "~/tournament/player-game-model.server";

export function getOutcomeBonus(outcome: PlayerGame["outcome"]): number {
  switch (outcome) {
    case "Win":
      return 3;
    case "Draw":
      return 1;
    default:
      return 0;
  }
}

export function getRoutedBonus(routed_points: number): number {
  switch (true) {
    case routed_points >= 1695:
      return 3;
    case routed_points >= 1100:
      return 2;
    case routed_points >= 500:
      return 1;
    default:
      return 0;
  }
}
