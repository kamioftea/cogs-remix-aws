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

export function getRoutedBonus(
  routed_points: number,
  bands: [number, number][] = [
    [1695, 3],
    [1110, 2],
    [500, 1],
  ],
): number {
  let band = bands.find(([threshold]) => {
    console.log({ threshold, asNum: Number(threshold), routed_points });
    return routed_points >= Number(threshold);
  });
  console.log(band, routed_points, band?.[1] ?? 0);

  return band?.[1] ?? 0;
}
