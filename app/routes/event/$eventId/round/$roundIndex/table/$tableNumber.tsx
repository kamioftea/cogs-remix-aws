import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { PlayerGame } from "~/tournament/player-game-model.server";
import { getPlayersByTable } from "~/tournament/player-game-model.server";
import type { AttendeeDisplayData } from "~/tournament/attendee-model.server";
import { attendeeDisplayDataBySlug } from "~/tournament/attendee-model.server";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import React, { Fragment } from "react";
import { ArmyList } from "~/tournament/army-list-field";

interface LoaderData {
  playerGames: PlayerGame[];
  attendeesBySlug: Record<string, AttendeeDisplayData>;
  tableNumber: number;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");
  invariant(params.tableNumber, "tableNumber not found");

  if (!params.tableNumber.match(/^\d+$/)) {
    throw new Response("roundIndex must be an integer", { status: 400 });
  }

  const roundIndex = parseInt(params.roundIndex);
  const tableNumber = parseInt(params.tableNumber);

  const playerGames = (
    await getPlayersByTable(params.eventId, roundIndex - 1, tableNumber)
  ).filter((pg) => pg.published);

  const attendeesBySlug = await attendeeDisplayDataBySlug(params.eventId);

  return json<LoaderData>({
    playerGames: playerGames,
    attendeesBySlug,
    tableNumber,
  });
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }) => {
      const { tableNumber } = data as LoaderData;
      return `Table ${tableNumber}`;
    },
    url: CURRENT,
  },
];

export const handle = { breadcrumbs };

export default function RoundIndexPage() {
  const { playerGames, attendeesBySlug, tableNumber } = useLoaderData<
    typeof loader
  >() as LoaderData;

  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  if ((playerGames || []).length === 0) {
    return null;
  }

  return (
    <>
      <h3>Table {tableNumber}</h3>
      <div className="matchup-container">
        {playerGames.map((game, index) => {
          const attendee = attendeesBySlug[game.attendeeSlug];
          return (
            <Fragment key={game.attendeeSlug}>
              <div className="player-card">
                <h3>
                  <Link
                    to={`/event/${tournament.slug}/profile/${game.attendeeSlug}`}
                  >
                    {attendee.name}
                  </Link>
                  <br />
                  <small>{attendee.faction}</small>
                </h3>
                {attendee.army_list && (
                  <ArmyList
                    uploadId={attendee.army_list}
                    eventSlug={tournament.slug}
                    attendeeSlug={game.attendeeSlug}
                  />
                )}
              </div>
              {index === 0 && <div className="vs">vs</div>}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
