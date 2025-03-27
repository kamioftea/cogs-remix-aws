import arc from "@architect/functions";
import type { Attendee } from "~/tournament/attendee-model.server";
import {
  getTournamentAttendeeBySlug,
  listTournamentAttendeesByEventSlug,
  putAttendee,
} from "~/tournament/attendee-model.server";
import { sortBy, toPairs } from "~/utils";
import { purgeUndefined } from "~/utils/purgeUndefined";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import {
  getOutcomeBonus,
  getRoutedBonus,
} from "~/tournament/player-game-model";
import invariant from "tiny-invariant";

export type GameOutcome = "Win" | "Draw" | "Loss";

export interface PlayerGame {
  eventRound: string;
  eventSlug: string;
  roundIndex: number;
  tableNumber: number;
  attendeeSlug: string;
  published: boolean;
  locked: boolean;
  outcome?: GameOutcome;
  routedPoints?: number;
  scoreBreakdown?: Record<string, number>;
  scenarioScore?: number;
  totalScore?: number;
}

function recordToPlayerGame(result: any): PlayerGame {
  return {
    eventRound: result.eventRound,
    eventSlug: result.eventSlug,
    roundIndex: result.roundIndex,
    tableNumber: result.tableNumber,
    attendeeSlug: result.attendeeSlug,
    published: !!result.published,
    locked: !!result.locked,
    outcome: result.outcome,
    routedPoints: result.routedPoints,
    scoreBreakdown: result.scoreBreakdown,
    scenarioScore: result.scenarioScore,
    totalScore: result.totalScore,
  };
}

export async function getGamesForRound(
  eventSlug: string,
  roundIndex: number,
): Promise<PlayerGame[]> {
  const db = await arc.tables();

  const result = await db.playerGame.query({
    KeyConditionExpression: "eventRound = :eventRound",
    ExpressionAttributeValues: { ":eventRound": `${eventSlug}--${roundIndex}` },
  });

  return (
    result?.Items.map(recordToPlayerGame).sort((a, b) =>
      a.tableNumber != b.tableNumber
        ? a.tableNumber - b.tableNumber
        : a.attendeeSlug.localeCompare(b.attendeeSlug),
    ) ?? []
  );
}

async function createPlayerGame(
  attendee: Attendee,
  roundIndex: number,
  table: number,
): Promise<PlayerGame> {
  const db = await arc.tables();

  const playerGame: PlayerGame = {
    eventRound: `${attendee.eventSlug}--${roundIndex}`,
    eventSlug: attendee.eventSlug,
    roundIndex,
    tableNumber: table,
    attendeeSlug: attendee.slug,
    published: false,
    locked: false,
  };
  const result = await db.playerGame.put(playerGame);

  return recordToPlayerGame(result);
}

export async function populateRound(eventSlug: string, roundIndex: number) {
  const attendees = await listTournamentAttendeesByEventSlug(eventSlug);
  const existing = await getGamesForRound(eventSlug, roundIndex);

  let [maxTable, toAssign] = existing.reduce(
    ([maxTable, toAssign], gamePlayer) => [
      Math.max(maxTable, gamePlayer.tableNumber),
      toAssign.filter((a) => a.slug !== gamePlayer.attendeeSlug),
    ],
    [0, attendees],
  );

  toAssign.sort(
    sortBy(
      (a) => -parseInt(a.additionalFields?.tournament_points || "0"),
      (a) => -parseInt(a.additionalFields?.total_routed || "0"),
      (a) => parseInt(a.additionalFields?.total_attrition || "0"),
      () => Math.random(),
    ),
  );

  await Promise.all(
    toPairs(toAssign).map(async ([a, b]) => {
      maxTable = maxTable + 1;
      a && (await createPlayerGame(a, roundIndex, maxTable));
      b && (await createPlayerGame(b, roundIndex, maxTable));
    }),
  );
}

export async function publishRound(eventSlug: string, roundIndex: number) {
  const existing = await getGamesForRound(eventSlug, roundIndex);

  const db = await arc.tables();

  await Promise.all(
    existing.map((pg) =>
      db.playerGame.put(purgeUndefined({ ...pg, published: true })),
    ),
  );
}

export async function lockRound(eventSlug: string, roundIndex: number) {
  const existing = await getGamesForRound(eventSlug, roundIndex);

  const db = await arc.tables();

  await Promise.all(
    existing.map((pg) =>
      db.playerGame.put(purgeUndefined({ ...pg, locked: true })),
    ),
  );
}

export async function putPlayerGame(game: PlayerGame) {
  const db = await arc.tables();

  await db.playerGame.put(purgeUndefined(game));
}

export async function getPlayersByTable(
  eventSlug: string,
  roundIndex: number,
  tableNumber: number,
): Promise<PlayerGame[]> {
  const db = await arc.tables();

  const result = await db.playerGame.query({
    KeyConditionExpression:
      "eventRound = :eventRound AND tableNumber = :tableNumber",
    ExpressionAttributeValues: {
      ":eventRound": `${eventSlug}--${roundIndex}`,
      ":tableNumber": tableNumber,
    },
    IndexName: "byRoundTable",
  });

  return result?.Items.map(recordToPlayerGame);
}

export async function getGamesForAttendee(
  eventSlug: string,
  attendeeSlug: string,
): Promise<PlayerGame[]> {
  const db = await arc.tables();

  const result = await db.playerGame.query({
    KeyConditionExpression:
      "eventSlug = :eventSlug AND attendeeSlug = :attendeeSlug",
    ExpressionAttributeValues: {
      ":eventSlug": eventSlug,
      ":attendeeSlug": attendeeSlug,
    },
    IndexName: "byEventAttendee",
  });

  return result?.Items.map(recordToPlayerGame);
}

export async function updateScoresForTable(
  eventSlug: string,
  roundIndex: number,
  tableNumber: number,
) {
  const tournament = getTournamentBySlug(eventSlug);
  if (!tournament) {
    return;
  }
  const { scenario } = tournament.scenarios[roundIndex];

  const [playerA, playerB] = await getPlayersByTable(
    eventSlug,
    roundIndex,
    tableNumber,
  );

  const enteredA =
    Object.keys(playerA.scoreBreakdown ?? {}).length ===
    scenario.scoreInputs.length;
  const enteredB =
    Object.keys(playerB.scoreBreakdown ?? {}).length ===
    scenario.scoreInputs.length;

  if (!enteredA || !enteredB) {
    return;
  }
  invariant(playerA.scoreBreakdown !== undefined);
  invariant(playerB.scoreBreakdown !== undefined);

  const scenarioScoreA = scenario.tournamentPointFunction(
    playerA.scoreBreakdown,
    playerB.scoreBreakdown,
  );
  const scenarioScoreB = scenario.tournamentPointFunction(
    playerB.scoreBreakdown,
    playerA.scoreBreakdown,
  );

  const toOutcomes: () => [GameOutcome, GameOutcome] = () => {
    switch (true) {
      case scenarioScoreA > scenarioScoreB:
        return ["Win", "Loss"];
      case scenarioScoreA < scenarioScoreB:
        return ["Loss", "Win"];
      default:
        return ["Draw", "Draw"];
    }
  };
  const [outcomeA, outcomeB] = toOutcomes();

  playerA.scenarioScore = scenarioScoreA;
  playerA.outcome = outcomeA;
  playerA.totalScore =
    scenarioScoreA +
    getOutcomeBonus(outcomeA, tournament) +
    getRoutedBonus(playerA.routedPoints ?? 0);

  playerB.scenarioScore = scenarioScoreB;
  playerB.outcome = outcomeB;
  playerB.totalScore =
    scenarioScoreB +
    getOutcomeBonus(outcomeB, tournament) +
    getRoutedBonus(playerB.routedPoints ?? 0);

  await putPlayerGame(playerA);
  await putPlayerGame(playerB);

  await updateScoresForAttendee(playerA, playerB.routedPoints ?? 0);
  await updateScoresForAttendee(playerB, playerA.routedPoints ?? 0);
}

async function updateScoresForAttendee(game: PlayerGame, attrition: number) {
  const attendee = await getTournamentAttendeeBySlug(
    game.eventSlug,
    game.attendeeSlug,
  );

  if (!attendee) {
    return;
  }

  attendee.scoresPerRound = attendee.scoresPerRound ?? [];
  attendee.scoresPerRound[game.roundIndex] = game.totalScore ?? 0;

  attendee.routedPerRound = attendee.routedPerRound ?? [];
  attendee.routedPerRound[game.roundIndex] = game.routedPoints ?? 0;

  attendee.attritionPerRound = attendee.attritionPerRound ?? [];
  attendee.attritionPerRound[game.roundIndex] = attrition ?? 0;

  attendee.additionalFields["tournament_points"] = attendee.scoresPerRound
    .reduce(
      (acc, num) => acc + num,
      attendee.additionalFields["bonus_points"]
        ? parseInt(attendee.additionalFields["bonus_points"])
        : 0,
    )
    .toString();

  attendee.additionalFields["total_routed"] = attendee.routedPerRound
    .reduce((acc, num) => acc + num, 0)
    .toString();

  attendee.additionalFields["total_attrition"] = attendee.attritionPerRound
    .reduce((acc, num) => acc + num, 0)
    .toString();

  await putAttendee(attendee);
}
