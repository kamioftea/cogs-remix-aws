import type { PlayerGame } from "~/tournament/player-game-model.server";
import type { Tournament } from "~/tournament/tournament-model.server";

export function getOutcomeBonus(
  outcome: PlayerGame["outcome"],
  tournament: Tournament,
): number {
  switch (outcome) {
    case "Win":
      return tournament.bonusPoints?.win ?? 3;
    case "Draw":
      return tournament.bonusPoints?.draw ?? 1;
    default:
      return tournament.bonusPoints?.loss ?? 0;
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
