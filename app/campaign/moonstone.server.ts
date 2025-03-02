import type { Player, Character, PlayerGame } from "~/campaign/moonstone";

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
  ClaudiaDuvel: {
    name: "Claudia Duvel",
    cardId: "ClaudiaDuvel",
    moveId: "StandDeliver",
  },
  Creep: {
    name: "Creep",
    cardId: "Creep",
    moveId: "SlipIntoShadows",
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
  TheDuchess: {
    name: "The Duchess",
    cardId: "TheDuchess",
    moveId: "ThreatsPromises",
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
      { cardId: "Joanna", joined: "Feb", moonstones: 0, kills: 2, deaths: 0 },
      { cardId: "Olim", joined: "Feb", moonstones: 0, kills: 0, deaths: 1 },
      {
        cardId: "YoungJack",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 0,
      },
      { cardId: "Morris", joined: "Feb", moonstones: 2, kills: 0, deaths: 0 },
    ],
  },
  kevin: {
    name: "Kevin",
    faction: "Leshavult",
    characters: [
      { cardId: "Dranyer", joined: "Feb", moonstones: 1, kills: 0, deaths: 0 },
      { cardId: "Snag", joined: "Feb", moonstones: 0, kills: 0, deaths: 1 },
      { cardId: "Gump", joined: "Feb", moonstones: 1, kills: 0, deaths: 0 },
      {
        cardId: "TheRevenant",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 0,
      },
    ],
  },
  andy: {
    name: "Andy",
    faction: "Leshavult",
    characters: [
      { cardId: "Antonia", joined: "Feb", moonstones: 0, kills: 1, deaths: 0 },
      { cardId: "Danica", joined: "Feb", moonstones: 1, kills: 0, deaths: 0 },
      { cardId: "Zorya", joined: "Feb", moonstones: 0, kills: 0, deaths: 1 },
      { cardId: "Snag", joined: "Feb", moonstones: 0, kills: 0, deaths: 1 },
    ],
  },
  richard: {
    name: "Richard",
    faction: "Dominion",
    characters: [
      { cardId: "Wasp", joined: "Feb", moonstones: 1, kills: 0, deaths: 0 },
      { cardId: "Fraya", joined: "Feb", moonstones: 0, kills: 0, deaths: 0 },
      {
        cardId: "TheFencer",
        joined: "Feb",
        moonstones: 1,
        kills: 1,
        deaths: 0,
      },
      { cardId: "TeeToe", joined: "Feb", moonstones: 1, kills: 0, deaths: 0 },
    ],
  },
  brendan: {
    name: "Brendan",
    faction: "Dominion",
    characters: [
      {
        cardId: "ElCapitano",
        joined: "Feb",
        moonstones: 2,
        kills: 2,
        deaths: 0,
      },
      {
        cardId: "SwiggartySwooty",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 1,
      },
      {
        cardId: "CrustyBalboa",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 1,
      },
      {
        cardId: "PowderMonkey",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 1,
      },
    ],
  },
  rob: {
    name: "Rob",
    faction: "Dominion",
    characters: [
      { cardId: "Doug", joined: "Feb", moonstones: 3, kills: 2, deaths: 0 },
      {
        cardId: "Shabbaroon",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 1,
      },
      {
        cardId: "PortlyPete",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 1,
      },
      { cardId: "Swash", joined: "Feb", moonstones: 0, kills: 1, deaths: 1 },
    ],
  },
  justin: {
    name: "Justin",
    faction: "Dominion",
    characters: [
      {
        cardId: "Shabbaroon",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 1,
      },
      {
        cardId: "BoomBoomMcBoom",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 1,
      },
      {
        cardId: "SeasickStu",
        joined: "Feb",
        moonstones: 2,
        kills: 0,
        deaths: 0,
      },
      {
        cardId: "ElCapitano",
        joined: "Feb",
        moonstones: 0,
        kills: 1,
        deaths: 1,
      },
    ],
  },
  phillip: {
    name: "Phil",
    faction: "Dominion",
    characters: [
      {
        cardId: "TheDuchess",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 1,
      },
      { cardId: "Creep", joined: "Feb", moonstones: 1, kills: 0, deaths: 0 },
      {
        cardId: "ClaudiaDuvel",
        joined: "Feb",
        moonstones: 1,
        kills: 2,
        deaths: 0,
      },
      {
        cardId: "TheRevenant",
        joined: "Feb",
        moonstones: 1,
        kills: 1,
        deaths: 0,
      },
    ],
  },
};

export const games: { [key: string]: { [key: string]: PlayerGame } } = {
  february: {
    phillip: {
      table: 1,
      moonstones: 2,
    },
    justin: {
      table: 1,
      moonstones: 3,
    },
    rob: {
      table: 2,
      moonstones: 3,
    },
    brendan: {
      table: 2,
      moonstones: 2,
    },
    kevin: {
      table: 3,
      moonstones: 2,
    },
    richard: {
      table: 3,
      moonstones: 3,
    },
    andy: {
      table: 4,
      moonstones: 1,
    },
    jeff: {
      table: 4,
      moonstones: 2,
    },
  },
};
