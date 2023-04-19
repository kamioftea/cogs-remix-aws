import { LoaderFunction } from "@remix-run/router";
import invariant from "tiny-invariant";
import {
  GameResult,
  getGamesForRound,
  PlayerGame,
} from "~/tournament/player-game-model.server";
import {
  Attendee,
  listTournamentAttendeesByEventSlug,
} from "~/tournament/attendee-model.server";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { sortBy } from "~/utils";
import { ReactNode } from "react";
import { TournamentLoaderData } from "~/routes/event/$eventId";
import { RoundLoaderData } from "~/routes/event/$eventId/round/$roundIndex";

interface LoaderData {
  playerGames: PlayerGame[];
  attendeesBySlug: Record<string, Attendee>;
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
  const attendeesBySlug = Object.fromEntries(
    (await listTournamentAttendeesByEventSlug(params.eventId)).map((a) => [
      a.slug,
      a,
    ])
  );

  return json<LoaderData>({
    playerGames: playerGames,
    attendeesBySlug,
  });
};

function resultToOrder(result: GameResult | undefined): number {
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
      <h2>Tables</h2>
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
                  (pg) => resultToOrder(pg.result),
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
                          to={`/event/${tournament.slug}/profile/${
                            attendeesBySlug[pg.attendeeSlug].slug
                          }`}
                        >
                          {attendeesBySlug[pg.attendeeSlug]?.name ??
                            pg.attendeeSlug}
                          <br />
                          <small>
                            {
                              attendeesBySlug[pg.attendeeSlug]?.additionalFields
                                ?.faction
                            }
                          </small>
                        </Link>
                      </td>
                      <td>{pg.result ?? "-"}</td>
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
