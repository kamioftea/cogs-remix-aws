export type Character = {
  name: string;
  cardId: string;
  moveId: string;
};

export type RosterCharacter = {
  cardId: string;
  joined: string;
  moonstones: number;
  kills: number;
  deaths: number;
  upgrade?: string;
  retired?: string;
};

export type Player = {
  name: string;
  faction?: "Commonwealth" | "Dominion" | "Leshavult" | "Shades";
  characters: RosterCharacter[];
  moonstones?: number;
  kills?: number;
  deaths?: number;
};

export type PlayerGame = {
  table: number;
  moonstones: number;
};

export interface AugmentedGame extends PlayerGame {
  playerSlug: string;
  player: Player;
}
