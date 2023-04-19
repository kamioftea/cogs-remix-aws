import arc from "@architect/functions";
import {
  Attendee,
  listTournamentAttendeesByEventSlug,
} from "~/tournament/attendee-model.server";
import { sortBy, toPairs } from "~/utils";
import { purgeUndefined } from "~/utils/purgeUndefined";

export type GameResult = "Win" | "Draw" | "Loss";

export interface PlayerGame {
  eventRound: string;
  roundIndex: number;
  tableNumber: number;
  attendeeSlug: string;
  published: boolean;
  result?: GameResult;
  routedPoints?: number;
  scoreBreakdown?: Record<string, number>;
  totalScore?: number;
}

function recordToPlayerGame(result: any): PlayerGame {
  return {
    eventRound: result.eventRound,
    roundIndex: result.roundIndex,
    tableNumber: result.tableNumber,
    attendeeSlug: result.attendeeSlug,
    published: !!result.published,
    result: result.result,
    routedPoints: result.routedPoints,
    scoreBreakdown: result.scoreBreakdown,
    totalScore: result.totalScore,
  };
}

export async function getGamesForRound(
  eventSlug: string,
  roundIndex: number
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
        : a.attendeeSlug.localeCompare(b.attendeeSlug)
    ) ?? []
  );
}

async function createPlayerGame(
  attendee: Attendee,
  roundIndex: number,
  table: number
): Promise<PlayerGame> {
  const db = await arc.tables();

  const playerGame: PlayerGame = {
    eventRound: `${attendee.eventSlug}--${roundIndex}`,
    roundIndex,
    tableNumber: table,
    attendeeSlug: attendee.slug,
    published: false,
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
    [0, attendees]
  );

  toAssign.sort(
    sortBy(
      (a) => parseInt(a.additionalFields?.tournament_points || "0"),
      (a) => parseInt(a.additionalFields?.totalrouted || "0"),
      () => Math.random()
    )
  );

  toPairs(toAssign).forEach(([a, b]) => {
    maxTable = maxTable + 1;
    a && createPlayerGame(a, roundIndex, maxTable);
    b && createPlayerGame(b, roundIndex, maxTable);
  });
}

export async function publishRound(eventSlug: string, roundIndex: number) {
  const existing = await getGamesForRound(eventSlug, roundIndex);

  const db = await arc.tables();

  await Promise.all(
    existing.map((pg) =>
      db.playerGame.put(purgeUndefined({ ...pg, published: true }))
    )
  );
}

export async function savePlayerGame(game: PlayerGame) {
  const db = await arc.tables();

  await db.playerGame.put(purgeUndefined(game));
}

export async function getPlayersByTable(
  eventSlug: string,
  roundIndex: number,
  tableNumber: number
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
