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

export type RosterCharacterV2 = Omit<RosterCharacter, 'kills' | 'deaths'>;

export type Player = {
  name: string;
  faction?: "Commonwealth" | "Dominion" | "Leshavult" | "Shades";
  characters: RosterCharacter[];
  vps?: number;
  mps?: number;
  kills?: number;
  deaths?: number;
};

export type PlayerV2 = Omit<Player, 'characters'> & {characters: RosterCharacterV2[]};

export type PlayerGame = {
  table: number;
  moonstones: number;
  campaignCards?: string[];
  extraVictoryPoints?: number;
  machinationPoints?: number;
};

export interface AugmentedGame extends PlayerGame {
  playerSlug: string;
  player: Player;
}

export interface AugmentedGameV2 extends PlayerGame {
  playerSlug: string;
  player: PlayerV2;
}
