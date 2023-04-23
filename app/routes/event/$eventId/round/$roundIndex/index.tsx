import type { LoaderFunction } from "@remix-run/router";
import invariant from "tiny-invariant";
import type {
  GameOutcome,
  PlayerGame,
} from "~/tournament/player-game-model.server";
import { getGamesForRound } from "~/tournament/player-game-model.server";
import type { AttendeeDisplayData } from "~/tournament/attendee-model.server";
import { attendeeDisplayDataBySlug } from "~/tournament/attendee-model.server";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { sortBy } from "~/utils";
import type { ReactNode } from "react";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import type { RoundLoaderData } from "~/routes/event/$eventId/round/$roundIndex";

interface LoaderData {
  playerGames: PlayerGame[];
  attendeesBySlug: Record<string, AttendeeDisplayData>;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");

  if (!params.roundIndex.match(/^\d+$/)) {
    throw new Response("roundIndex must be an integer", { status: 400 });
  }

  const roundIndex = parseInt(params.roundIndex);

  const playerGames = (
    await getGamesForRound(params.eventId, roundIndex - 1)
  ).filter((pg) => pg.published);
  const attendeesBySlug = await attendeeDisplayDataBySlug(params.eventId);

  return json<LoaderData>({
    playerGames: playerGames,
    attendeesBySlug,
  });
};

function resultToOrder(result: GameOutcome | undefined): number {
  switch (result) {
    case "Win":
      return 0;
    case "Draw":
      return 1;
    case "Loss":
      return 2;
    default:
      return -1;
  }
}

export default function RoundIndexPage() {
  const { playerGames, attendeesBySlug } = useLoaderData<
    typeof loader
  >() as LoaderData;

  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  const { roundIndex } = useRouteLoaderData(
    "routes/event/$eventId/round/$roundIndex"
  ) as RoundLoaderData;

  if ((playerGames || []).length === 0) {
    return null;
  }

  return (
    <>
      <h3>Tables</h3>
      <table>
        <thead>
          <tr>
            <th>Table</th>
            <th>Player</th>
            <th>Outcome</th>
            <th>Points</th>
            <th>Routed</th>
          </tr>
        </thead>
        <tbody>
          {
            playerGames
              .sort(
                sortBy(
                  (pg) => pg.tableNumber,
                  (pg) => resultToOrder(pg.outcome),
                  (pg) => -(pg.routedPoints ?? 0),
                  (pg) => pg.attendeeSlug
                )
              )
              .reduce<{ prevTable: number; rows: ReactNode[] }>(
                ({ prevTable, rows }, pg) => ({
                  prevTable: pg.tableNumber,
                  rows: [
                    ...rows,
                    <tr key={pg.attendeeSlug}>
                      {prevTable !== pg.tableNumber && (
                        <td rowSpan={2}>
                          <Link
                            to={`/event/${tournament.slug}/round/${roundIndex}/table/${pg.tableNumber}`}
                          >
                            Table {pg.tableNumber}
                          </Link>
                        </td>
                      )}
                      <td>
                        <Link
                          to={`/event/${tournament.slug}/profile/${pg.attendeeSlug}`}
                        >
                          {attendeesBySlug[pg.attendeeSlug]?.name ??
                            pg.attendeeSlug}
                          <br />
                          <small>
                            {attendeesBySlug[pg.attendeeSlug]?.faction}
                          </small>
                        </Link>
                      </td>
                      <td>{pg.outcome ?? "-"}</td>
                      <td>{pg.totalScore ?? "-"}</td>
                      <td>{pg.routedPoints ?? "-"}</td>
                    </tr>,
                  ],
                }),
                { prevTable: 0, rows: [] }
              ).rows
          }
        </tbody>
      </table>
    </>
  );
}
