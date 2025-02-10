export type Character = {
  name: string;
  cardId: string;
  moveId: string;
};

export type Player = {
  name: string;
  faction?: "Commonwealth" | "Dominion" | "Leshavult" | "Shades";
  characters: { cardId: string; joined: string }[];
  moonstones: number;
};

export type PlayerGame = {
  table: number;
  moonstones: number;
};

export interface AugmentedGame extends PlayerGame {
  playerSlug: string;
  player: Player;
}
