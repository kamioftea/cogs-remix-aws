import type { Player, Character, PlayerGame, PlayerV2 } from "~/campaign/moonstone";

export const characters: { [key: string]: Character } = {
  Antonia: {
    name: "Antonia, Noonday Witch",
    cardId: "Antonia",
    moveId: "Deception"
  },
  AnyaBartol: {
    name: "Anya Bartol",
    cardId: "AnyaBartol",
    moveId: "LostControl"
  },
  BrotherDaniel: {
    name: "Brother Daniel",
    cardId: "BrotherDaniel",
    moveId: "Thwack"
  },
  BoomBoomMcBoom: {
    name: "Boom Boom McBoom",
    cardId: "BoomBoomMcBoom",
    moveId: "NowYouSeeMe"
  },
  Boulder: {
    name: "Boulder",
    cardId: "Boulder",
    moveId: "CrushingEmbrace"
  },
  Butterfingers: {
    name: "Butterfingers",
    cardId: "Butterfingers",
    moveId: "FaerieDust"
  },
  Chezapeaky: {
    name: "Chezapeaky",
    cardId: "Chezapeaky",
    moveId: "CrushingPressure"
  },
  ClaudiaDuvel: {
    name: "Claudia Duvel",
    cardId: "ClaudiaDuvel",
    moveId: "StandDeliver"
  },
  CommodoreDelahaye: {
    name: "Commodore Delahaye",
    cardId: "CommodoreDelehaye",
    moveId: "21GhoulSalute"
  },
  Creep: {
    name: "Creep",
    cardId: "Creep",
    moveId: "SlipIntoShadows"
  },
  CrustyBalboa: {
    name: "Crusty Balboa",
    cardId: "CrustyBalboa",
    moveId: "FirstOfTheMonth"
  },
  Danica: {
    name: "Danica, Dusk Witch",
    cardId: "Danica",
    moveId: "Illusion"
  },
  Dentia: {
    name: "Dentia",
    cardId: "Dentia",
    moveId: "Extraction"
  },
  Doug: {
    name: "Doug, the Flatulent",
    cardId: "Doug",
    moveId: "AnkleBiter"
  },
  Dranyer: {
    name: "Dranyer",
    cardId: "Dranyer",
    moveId: "Duplicity"
  },
  ElCapitano: {
    name: "El Capitano",
    cardId: "ElCapitano",
    moveId: "JollyRoger"
  },
  EricTheEnlightened: {
    name: "Eric, the Enlightened",
    cardId: "EricTheEnlightened",
    moveId: "SwingingAntlers"
  },
  FlindersMemphis: {
    name: "Flinders Memphis",
    cardId: "FlindersMemphis",
    moveId: "CompressedAir"
  },
  Fraya: {
    name: "Fraya",
    cardId: "Fraya",
    moveId: "CantHitMe"
  },
  Gradock: {
    name: "Gradock",
    cardId: "Gradock",
    moveId: "TheOldSlipStep"
  },
  Gump: {
    name: "Gump",
    cardId: "Gump",
    moveId: "Rooted"
  },
  IrisAndHellebore: {
    name: "Iris & Hellebore",
    cardId: "IrisAndHellebore",
    moveId: "FromBelowAndAbove"
  },
  Joanna: {
    name: "Joanna, Nordic Princess",
    cardId: "Joanna",
    moveId: "ValkyrieCyclone"
  },
  Kalista: {
    name: "Kalista, Leshavult Princess",
    cardId: "Kalista",
    moveId: "SlipIntoShadows"
  },
  Klaus: {
    name: "Klaus",
    cardId: "Klaus",
    moveId: "FlailAroundMadly"
  },
  MamaGimble: {
    name: "Mama Gimble",
    cardId: "MamaGimble",
    moveId: "YoullRegretThat"
  },
  Matilda: {
    name: "Matilda",
    cardId: "Matilda",
    moveId: "LeapedLoaded"
  },
  Morris: {
    name: "Morris",
    cardId: "Morris",
    moveId: "PickAFight"
  },
  Muridae: {
    name: "Muridae",
    cardId: "Muridae",
    moveId: "Hamstring"
  },
  OldPolly: {
    name: "Old Polly",
    cardId: "OldPolly",
    moveId: "CockatriceStare"
  },
  Olim: {
    name: "Olim",
    cardId: "Olim",
    moveId: "Fetch"
  },
  Peggy: {
    name: "Peggy",
    cardId: "Peggy",
    moveId: "RunEmThrough"
  },
  PortlyPete: {
    name: "Portly Pete",
    cardId: "PortlyPete",
    moveId: "CrowdControl"
  },
  PowderMonkey: {
    name: "Powder Monkey",
    cardId: "PowderMonkey",
    moveId: "DrunkenMonkeyStance"
  },
  ProfBoffinsworth: {
    name: "Prof. Boffinsworth",
    cardId: "ProfBoffinsworth",
    moveId: "BoffsBestiary"
  },
  Quarrel: {
    name: "Quarrel",
    cardId: "Quarrel",
    moveId: "TacticalRetreat"
  },
  Raegan: {
    name: "Raegan, Leshavult Priestess",
    cardId: "Raegan",
    moveId: "Mistform"
  },
  Ribald: {
    name: "Ribald",
    cardId: "Ribald",
    moveId: "ShortFuse"
  },
  Ruwt: {
    name: "Ruwt",
    cardId: "Ruwt",
    moveId: "EncroachingRoots"
  },
  SeasickStu: {
    name: "Seasick Stu",
    cardId: "SeasickStu",
    moveId: "ItsABigun"
  },
  Shabbaroon: {
    name: "Shabbaroon",
    cardId: "Shabbaroon",
    moveId: "Fuddlemuddle"
  },
  Silvertongue: {
    name: "Silvertongue",
    cardId: "Silvertongue",
    moveId: "ThreatsPromises"
  },
  Snag: {
    name: "Snag",
    cardId: "Snag",
    moveId: "Hex"
  },
  Swash: {
    name: "Swash",
    cardId: "Swash",
    moveId: "FlashingBlades"
  },
  SwiggartySwooty: {
    name: "Swiggarty Swooty",
    cardId: "SwigartySwooty",
    moveId: "TentaiSurprise"
  },
  TeeToe: {
    name: "Teetoe",
    cardId: "TeeToe",
    moveId: "CantHitMe"
  },
  TheBeast: {
    name: "The Beast",
    cardId: "TheBeast",
    moveId: "Bellow"
  },
  TheDuchess: {
    name: "The Duchess",
    cardId: "TheDuchess",
    moveId: "ThreatsPromises"
  },
  TheFencer: {
    name: "The Fencer",
    cardId: "TheFencer",
    moveId: "Needlepoint"
  },
  TheGoblinKing: {
    name: "The Goblin King",
    cardId: "ThegoblinKing",
    moveId: "GrovelPeasant"
  },
  TheRevenant: {
    name: "The Revenant",
    cardId: "TheRevenant",
    moveId: "DestinyFulfilled"
  },
  ViciousSyd: {
    name: "Vicious Syd",
    cardId: "ViciousSyd",
    moveId: "GroinTickler"
  },
  Wasp: {
    name: "Wasp",
    cardId: "Wasp",
    moveId: "DivingAttack"
  },
  Wendigo: {
    name: "Wendigo",
    cardId: "Wendigo",
    moveId: "InsatiableHunger"
  },
  YoungJack: {
    name: "Young Jack",
    cardId: "YoungJack",
    moveId: "ShieldBash"
  },
  Zorya: {
    name: "Zorya, Dawn Witch",
    cardId: "Zorya",
    moveId: "Betrayal"
  }
};

export const players: Record<string, Player> = {
  jeff: {
    name: "Jeff",
    faction: "Commonwealth",
    characters: [
      {
        cardId: "Joanna",
        joined: "Feb",
        moonstones: 1,
        kills: 6,
        deaths: 2,
        upgrade: "Battle Hardened"
      },
      { cardId: "Olim", joined: "Feb", moonstones: 3, kills: 0, deaths: 1 },
      {
        cardId: "YoungJack",
        joined: "Feb",
        moonstones: 3,
        kills: 4,
        deaths: 2
      },
      {
        cardId: "Morris",
        joined: "Feb",
        moonstones: 9,
        kills: 2,
        deaths: 1,
        upgrade: "Polished Helmet"
      },
      { cardId: "Muridae", joined: "Mar", moonstones: 2, kills: 0, deaths: 0 },
      { cardId: "Quarrel", joined: "Apr", moonstones: 0, kills: 0, deaths: 0 },
      {
        cardId: "MamaGimble",
        joined: "May",
        moonstones: 0,
        kills: 2,
        deaths: 0
      },
      {
        cardId: "Gradock",
        joined: "Jun",
        moonstones: 0,
        kills: 0,
        deaths: 0
      }
    ]
  },
  kevin: {
    name: "Kevin",
    faction: "Leshavult",
    characters: [
      { cardId: "Dranyer", joined: "Feb", moonstones: 2, kills: 0, deaths: 2 },
      {
        cardId: "Snag",
        joined: "Feb",
        moonstones: 0,
        kills: 1,
        deaths: 4,
        upgrade: "Immaterial Essence"
      },
      {
        cardId: "Gump",
        joined: "Feb",
        moonstones: 4,
        kills: 2,
        deaths: 2,
        upgrade: "Menacing Words"
      },
      {
        cardId: "TheRevenant",
        joined: "Feb",
        moonstones: 1,
        kills: 3,
        deaths: 3
      },
      {
        cardId: "AnyaBartol",
        joined: "Mar",
        retired: "May",
        moonstones: 1,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "Ruwt",
        joined: "Apr",
        moonstones: 3,
        kills: 1,
        deaths: 2
      },
      {
        cardId: "Raegan",
        joined: "May",
        moonstones: 0,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "TheBeast",
        joined: "May",
        moonstones: 1,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "Klaus",
        joined: "Jun",
        moonstones: 0,
        kills: 0,
        deaths: 0
      }
    ]
  },
  andy: {
    name: "Andy",
    faction: "Leshavult",
    characters: [
      { cardId: "Antonia", joined: "Feb", moonstones: 1, kills: 1, deaths: 2 },
      { cardId: "Danica", joined: "Feb", moonstones: 3, kills: 0, deaths: 3 },
      {
        cardId: "Zorya",
        joined: "Feb",
        moonstones: 0,
        kills: 4,
        deaths: 3,
        upgrade: "Immaterial Essence"
      },
      {
        cardId: "Snag",
        joined: "Feb",
        moonstones: 0,
        kills: 0,
        deaths: 3,
        upgrade: "Menacing Words"
      },
      {
        cardId: "BrotherDaniel",
        joined: "Mar",
        moonstones: 5,
        kills: 0,
        deaths: 1
      },
      {
        cardId: "Kalista",
        joined: "Apr",
        moonstones: 0,
        kills: 0,
        deaths: 1
      },
      {
        cardId: "Wendigo",
        joined: "May",
        moonstones: 0,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "EricTheEnlightened",
        joined: "Jun",
        moonstones: 0,
        kills: 1,
        deaths: 0
      }
    ]
  },
  richard: {
    name: "Richard",
    faction: "Dominion",
    characters: [
      {
        cardId: "Wasp",
        joined: "Feb",
        retired: "May",
        moonstones: 1,
        kills: 0,
        deaths: 1
      },
      { cardId: "Fraya", joined: "Feb", moonstones: 2, kills: 0, deaths: 0 },
      {
        cardId: "TheFencer",
        joined: "Feb",
        moonstones: 1,
        kills: 3,
        deaths: 3,
        upgrade: "Unusual Odour"
      },
      { cardId: "TeeToe", joined: "Feb", moonstones: 8, kills: 0, deaths: 0 },
      {
        cardId: "Butterfingers",
        joined: "Mar",
        moonstones: 5,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "IrisAndHellebore",
        joined: "Apr",
        moonstones: 0,
        kills: 1,
        deaths: 2,
        upgrade: "Polished Helmet"
      },
      {
        cardId: "Silvertongue",
        joined: "May",
        moonstones: 0,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "Dentia",
        joined: "May",
        moonstones: 0,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "Boulder",
        joined: "Jun",
        moonstones: 0,
        kills: 1,
        deaths: 0
      }
    ]
  },
  brendan: {
    name: "Brendan",
    faction: "Dominion",
    characters: [
      {
        cardId: "ElCapitano",
        joined: "Feb",
        moonstones: 6,
        kills: 4,
        deaths: 0
      },
      {
        cardId: "SwiggartySwooty",
        joined: "Feb",
        moonstones: 2,
        kills: 1,
        deaths: 2
      },
      {
        cardId: "CrustyBalboa",
        joined: "Feb",
        moonstones: 3,
        kills: 1,
        deaths: 3,
        upgrade: "Cursed Heirloom"
      },
      {
        cardId: "PowderMonkey",
        joined: "Feb",
        moonstones: 1,
        kills: 0,
        deaths: 3
      },
      {
        cardId: "Swash",
        joined: "Mar",
        moonstones: 2,
        kills: 1,
        deaths: 2,
        upgrade: "Unusual Odour"
      },
      {
        cardId: "Peggy",
        joined: "Apr",
        moonstones: 0,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "Creep",
        joined: "May",
        moonstones: 1,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "Ribald",
        joined: "Jun",
        moonstones: 1,
        kills: 1,
        deaths: 0
      }
    ]
  },
  rob: {
    name: "Rob",
    faction: "Dominion",
    characters: [
      { cardId: "Doug", joined: "Feb", moonstones: 3, kills: 4, deaths: 2 },
      {
        cardId: "Shabbaroon",
        joined: "May",
        moonstones: 1,
        kills: 0,
        deaths: 2
      },
      {
        cardId: "PortlyPete",
        joined: "Feb",
        moonstones: 2,
        kills: 2,
        deaths: 2
      },
      { cardId: "Swash", joined: "Feb", moonstones: 0, kills: 2, deaths: 3 },
      {
        cardId: "ViciousSyd",
        joined: "Mar",
        moonstones: 2,
        kills: 1,
        deaths: 0
      },
      { cardId: "Peggy", joined: "Apr", moonstones: 0, kills: 0, deaths: 1 },
      {
        cardId: "AnyaBartol",
        joined: "Apr",
        moonstones: 2,
        kills: 0,
        deaths: 1
      },
      {
        cardId: "TheGoblinKing",
        joined: "Jun",
        moonstones: 0,
        kills: 0,
        deaths: 0
      }
    ]
  },
  justin: {
    name: "Justin",
    faction: "Dominion",
    characters: [
      {
        cardId: "Shabbaroon",
        joined: "Feb",
        moonstones: 1,
        kills: 0,
        deaths: 1
      },
      {
        cardId: "BoomBoomMcBoom",
        joined: "Feb",
        moonstones: 3,
        kills: 0,
        deaths: 2,
        upgrade: "A Pirate's Life For Me"
      },
      {
        cardId: "SeasickStu",
        joined: "Feb",
        moonstones: 3,
        kills: 2,
        deaths: 1
      },
      {
        cardId: "ElCapitano",
        joined: "Feb",
        moonstones: 1,
        kills: 4,
        deaths: 3,
        upgrade: "Cursed Heirloom"
      },
      {
        cardId: "CrustyBalboa",
        joined: "Mar",
        moonstones: 2,
        kills: 3,
        deaths: 0
      },
      {
        cardId: "SwiggartySwooty",
        joined: "Apr",
        moonstones: 2,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "Chezapeaky",
        joined: "May",
        moonstones: 0,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "CommodoreDelahaye",
        joined: "Jun",
        moonstones: 0,
        kills: 0,
        deaths: 0
      }
    ]
  },
  phillip: {
    name: "Phil",
    faction: "Dominion",
    characters: [
      {
        cardId: "TheDuchess",
        joined: "Feb",
        moonstones: 2,
        kills: 0,
        deaths: 2
      },
      { cardId: "Creep", joined: "Feb", moonstones: 2, kills: 0, deaths: 1 },
      {
        cardId: "ClaudiaDuvel",
        joined: "Feb",
        moonstones: 2,
        kills: 2,
        deaths: 2,
        upgrade: "Wheelbarrow"
      },
      {
        cardId: "TheRevenant",
        joined: "Feb",
        moonstones: 1,
        kills: 2,
        deaths: 2
      },
      {
        cardId: "TheBeast",
        joined: "Mar",
        moonstones: 0,
        kills: 1,
        deaths: 1
      },
      {
        cardId: "Ribald",
        joined: "Apr",
        moonstones: 2,
        kills: 5,
        deaths: 0,
        upgrade: "Fit As A Fiddle"
      },
      {
        cardId: "Boulder",
        joined: "May",
        moonstones: 0,
        kills: 0,
        deaths: 0
      },
      {
        cardId: "AnyaBartol",
        joined: "Jun",
        moonstones: 1,
        kills: 0,
        deaths: 0
      }
    ]
  }
};

export const games: { [key: string]: { [key: string]: PlayerGame } } = {
  february: {
    phillip: {
      table: 1,
      moonstones: 3
    },
    justin: {
      table: 1,
      moonstones: 2
    },
    rob: {
      table: 2,
      moonstones: 3
    },
    brendan: {
      table: 2,
      moonstones: 2
    },
    kevin: {
      table: 3,
      moonstones: 2
    },
    richard: {
      table: 3,
      moonstones: 3
    },
    andy: {
      table: 4,
      moonstones: 1
    },
    jeff: {
      table: 4,
      moonstones: 2
    }
  },
  march: {
    richard: {
      table: 1,
      moonstones: 4
    },
    andy: {
      table: 1,
      moonstones: 3
    },
    justin: {
      table: 2,
      moonstones: 3
    },
    rob: {
      table: 2,
      moonstones: 4
    },
    brendan: {
      table: 3,
      moonstones: 3
    },
    kevin: {
      table: 3,
      moonstones: 2
    },
    phillip: {
      table: 4,
      moonstones: 0
    },
    jeff: {
      table: 4,
      moonstones: 6
    }
  },
  april: {
    richard: {
      table: 1,
      moonstones: 4,
      machinationPoints: 3, // Support andy sabotage rob, 2 from nef bargain
      campaignCards: ["Rolling Stones", "Twist Time", "Ninja Reactions"]
    },
    jeff: {
      table: 1,
      moonstones: 3,
      machinationPoints: 1, // Support kev, support phil
      campaignCards: []
    },
    rob: {
      table: 2,
      moonstones: 0,
      machinationPoints: 0, // sab jeff, sup andy
      campaignCards: []
    },
    kevin: {
      table: 2,
      moonstones: 1,
      machinationPoints: 0,
      campaignCards: ["Rebirth Ritual"]
    },
    brendan: {
      table: 3,
      moonstones: 6,
      machinationPoints: 4, // stand alone, sup andy sab jeff
      campaignCards: ["Stand Alone"]
    },
    phillip: {
      table: 3,
      moonstones: 0,
      machinationPoints: 1, // over support
      extraVictoryPoints: 1,
      campaignCards: ["Forced March", "Ducks In A Barrel", "Nefarious Bargain"]
    },
    justin: {
      table: 4,
      moonstones: 4,
      machinationPoints: 1, // supp phil, sab jeff
      campaignCards: []
    },
    andy: {
      table: 4,
      moonstones: 2,
      machinationPoints: 2, // over support x 2,
      campaignCards: []
    }
  },
  may: {
    jeff: {
      table: 1,
      moonstones: 4,
      machinationPoints: 2 // Support kev and rob
    },
    kevin: {
      table: 1,
      moonstones: 2
    },
    brendan: {
      table: 2,
      moonstones: 2,
      machinationPoints: 3, // support rob, support phil, consolidate power
      campaignCards: ["Consolidate Power"]
    },
    justin: {
      table: 2,
      moonstones: 0,
      machinationPoints: 0, // +1 sabotage richard, -1 support Andy
      campaignCards: ["Pirate's Booty"]
    },
    richard: {
      table: 3,
      moonstones: 2,
      machinationPoints: 1 // support phil (and kev)
    },
    rob: {
      table: 3,
      moonstones: 3,
      machinationPoints: 1, // over support
      campaignCards: ["Hot Potato", "Hide And Seek"]
    },
    andy: {
      table: 4,
      moonstones: 2
    },
    phillip: {
      table: 4,
      machinationPoints: 2, // over support
      moonstones: 5
    }
  },
  june: {
    brendan: {
      table: 1,
      moonstones: 3,
      machinationPoints: 2, // +1 support rich +1 support rob
      campaignCards: ["Ducks In A Barrel"]
    },
    jeff: {
      table: 1,
      moonstones: 3,
      machinationPoints: 2, // +2 gamble the silverware,+! sup kev -1 sup just
      extraVictoryPoints: 3, // + 3VP Keep new robes clean, -1 Malign resurrection +1 Gamble the silverware
      campaignCards: [
        "Keeping The New Robes Clean",
        "Malign Resurrection",
        "Gamble The Silverware"
      ]
    },
    richard: {
      table: 2,
      moonstones: 4,
      machinationPoints: 5, //+1 sup kev, +1 sab justin +1 over sup, +2 high road
      campaignCards: ["The High Road", "Miraculous Recovery"]
    },
    phillip: {
      table: 2,
      moonstones: 3,
      extraVictoryPoints: -1,
      campaignCards: ["Make Your Own Luck"]
    },
    rob: {
      table: 3,
      moonstones: 4
    },
    justin: {
      table: 3,
      moonstones: 3,
      machinationPoints: 1 // +1 sup kev +0 sup andy
    },
    andy: {
      table: 4,
      moonstones: 1
    },
    kevin: {
      table: 4,
      moonstones: 5,
      machinationPoints: 5 // over support, +1 sup jeff, +1 sup rich
    }
  }
};

export const moonstone2026: {
  players: Record<string, PlayerV2>
  games: { [key: string]: { [key: string]: PlayerGame } }
} = {
  players: {
    jeff: {
      name: "Jeff",
      faction: "Commonwealth",
      characters: [
        { cardId: "Joanna", joined: "Feb", moonstones: 0 },
        { cardId: "Morris", joined: "Feb", moonstones: 0 },
        { cardId: "MamaGimble", joined: "Feb", moonstones: 0 },
        { cardId: "Matilda", joined: "Feb", moonstones: 0 },
        { cardId: "FlindersMemphis", joined: "Feb", moonstones: 0 },
        { cardId: "OldPolly", joined: "Feb", moonstones: 0 },
        { cardId: "ProfBoffinsworth", joined: "Feb", moonstones: 0 },
        { cardId: "Jackalope", joined: "Feb", moonstones: 0 }
      ]
    }
  },
  games: {}
};
