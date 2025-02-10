import type { Player, Character } from "~/campaign/moonstone";

export const characters: { [key: string]: Character } = {
  Antonia: {
    name: "Antonia, Noonday Witch",
    cardId: "Antonia",
    moveId: "Deception",
  },
  BoomBoomMcBoom: {
    name: "Boom Boom McBoom",
    cardId: "BoomBoomMcBoom",
    moveId: "NowYouSeeMe",
  },
  CrustyBalboa: {
    name: "Crusty Balboa",
    cardId: "CrustyBalboa",
    moveId: "FirstOfTheMonth",
  },
  Danica: {
    name: "Danica, Dusk Witch",
    cardId: "Danica",
    moveId: "Illusion",
  },
  Doug: {
    name: "Doug, the Flatulent",
    cardId: "Doug",
    moveId: "AnkleBiter",
  },
  Dranyer: {
    name: "Dranyer",
    cardId: "Dranyer",
    moveId: "Duplicity",
  },
  ElCapitano: {
    name: "El Capitano",
    cardId: "ElCapitano",
    moveId: "JollyRoger",
  },
  Fraya: {
    name: "Fraya",
    cardId: "Fraya",
    moveId: "CantHitMe",
  },
  Gump: {
    name: "Gump",
    cardId: "Gump",
    moveId: "Rooted",
  },
  Joanna: {
    name: "Joanna, Nordic Princess",
    cardId: "Joanna",
    moveId: "ValkyrieCyclone",
  },
  Morris: {
    name: "Morris",
    cardId: "Morris",
    moveId: "PickAFight",
  },
  Olim: {
    name: "Olim",
    cardId: "Olim",
    moveId: "Fetch",
  },
  PortlyPete: {
    name: "Portly Pete",
    cardId: "PortlyPete",
    moveId: "CrowdControl",
  },
  PowderMonkey: {
    name: "Powder Monkey",
    cardId: "PowderMonkey",
    moveId: "DrunkenMonkeyStance",
  },
  SeasickStu: {
    name: "Seasic Stu",
    cardId: "SeasickStu",
    moveId: "ItsABigun",
  },
  Shabbaroon: {
    name: "Shabbaroon",
    cardId: "Shabbaroon",
    moveId: "Fuddlemuddle",
  },
  Snag: {
    name: "Snag",
    cardId: "Snag",
    moveId: "Hex",
  },
  Swash: {
    name: "Swash",
    cardId: "Swash",
    moveId: "FlashingBlades",
  },
  SwiggartySwooty: {
    name: "Swiggarty Swooty",
    cardId: "SwigartySwooty",
    moveId: "TentaiSurprise",
  },
  TeeToe: {
    name: "Teetoe",
    cardId: "TeeToe",
    moveId: "CantHitMe",
  },
  TheFencer: {
    name: "The Fencer",
    cardId: "TheFencer",
    moveId: "Needlepoint",
  },
  TheRevenant: {
    name: "The Revenant",
    cardId: "TheRevenant",
    moveId: "DestinyFulfilled",
  },
  Wasp: {
    name: "Wasp",
    cardId: "Wasp",
    moveId: "DivingAttack",
  },
  YoungJack: {
    name: "Young Jack",
    cardId: "YoungJack",
    moveId: "ShieldBash",
  },
  Zorya: {
    name: "Zorya, Dawn Witch",
    cardId: "Zorya",
    moveId: "Betrayal",
  },
};

export const players: Record<string, Player> = {
  jeff: {
    name: "Jeff",
    faction: "Commonwealth",
    characters: [
      { cardId: "Joanna", joined: "Feb" },
      { cardId: "Olim", joined: "Feb" },
      { cardId: "YoungJack", joined: "Feb" },
      { cardId: "Morris", joined: "Feb" },
    ],
    moonstones: 0,
  },
  kevin: {
    name: "Kevin",
    faction: "Leshavult",
    characters: [
      { cardId: "Dranyer", joined: "Feb" },
      { cardId: "Snag", joined: "Feb" },
      { cardId: "Gump", joined: "Feb" },
      { cardId: "TheRevenant", joined: "Feb" },
    ],
    moonstones: 0,
  },
  andy: {
    name: "Andy",
    faction: "Leshavult",
    characters: [
      { cardId: "Antonia", joined: "Feb" },
      { cardId: "Danica", joined: "Feb" },
      { cardId: "Zorya", joined: "Feb" },
      { cardId: "Snag", joined: "Feb" },
    ],
    moonstones: 0,
  },
  richard: {
    name: "Richard",
    faction: "Dominion",
    characters: [
      { cardId: "Wasp", joined: "Feb" },
      { cardId: "Fraya", joined: "Feb" },
      { cardId: "TheFencer", joined: "Feb" },
      { cardId: "TeeToe", joined: "Feb" },
    ],
    moonstones: 0,
  },
  brendan: {
    name: "Brendan",
    faction: "Dominion",
    characters: [
      { cardId: "ElCapitano", joined: "Feb" },
      { cardId: "SwiggartySwooty", joined: "Feb" },
      { cardId: "CrustyBalboa", joined: "Feb" },
      { cardId: "PowderMonkey", joined: "Feb" },
    ],
    moonstones: 0,
  },
  rob: {
    name: "Rob",
    faction: "Dominion",
    characters: [
      { cardId: "Doug", joined: "Feb" },
      { cardId: "Shabbaroon", joined: "Feb" },
      { cardId: "PortlyPete", joined: "Feb" },
      { cardId: "Swash", joined: "Feb" },
    ],
    moonstones: 0,
  },
  justin: {
    name: "Justin",
    faction: "Dominion",
    characters: [
      { cardId: "Shabbaroon", joined: "Feb" },
      { cardId: "BoomBoomMcBoom", joined: "Feb" },
      { cardId: "SeasickStu", joined: "Feb" },
      { cardId: "ElCapitano", joined: "Feb" },
    ],
    moonstones: 0,
  },
  phillip: {
    name: "Phillip",
    characters: [],
    moonstones: 0,
  },
};

export const games: { [key: string]: { [key: string]: Game } } = {
  february: {
    phillip: {
      table: 1,
      moonstones: 0,
    },
    justin: {
      table: 1,
      moonstones: 0,
    },
    rob: {
      table: 2,
      moonstones: 0,
    },
    brendan: {
      table: 2,
      moonstones: 0,
    },
    kevin: {
      table: 3,
      moonstones: 0,
    },
    richard: {
      table: 3,
      moonstones: 0,
    },
    andy: {
      table: 4,
      moonstones: 0,
    },
    jeff: {
      table: 4,
      moonstones: 0,
    },
  },
};
