import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import type {
  Attendee,
  AttendeeDisplayData,
} from "~/tournament/attendee-model.server";
import {
  attendeeDisplayDataBySlug,
  getTournamentAttendeeBySlug,
  putAttendee,
} from "~/tournament/attendee-model.server";

import { getSessionAttendee } from "~/account/session.server";
import {
  Link,
  useCatch,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import { additionalFieldTypes } from "~/tournament/additional-fields";
import * as React from "react";
import { Fragment } from "react";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import type { PlayerGame } from "~/tournament/player-game-model.server";
import {
  getGamesForAttendee,
  getPlayersByTable,
} from "~/tournament/player-game-model.server";
import { sortBy } from "~/utils";
import { FiInfo } from "react-icons/fi";
import { SportsVotes } from "~/routes/event/$eventId/profile/$slug/sportsVotes";
import { PaintVotes } from "~/routes/event/$eventId/profile/$slug/paintVotes";
import { ActionFunction } from "@remix-run/router";

interface LoaderData {
  attendee: Attendee;
  games: { player: PlayerGame; opponent: PlayerGame }[];
  attendeesBySlug: Record<string, AttendeeDisplayData>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  invariant(params.slug, "From route");

  const tournament = getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const attendee = await getTournamentAttendeeBySlug(
    tournament.slug,
    params.slug
  );
  if (!attendee) {
    throw new Response("Attendee not found", { status: 404 });
  }

  const sessionAttendee = await getSessionAttendee(request, tournament.slug);

  const additionalFieldsPublic =
    tournament.listsSubmissionClosed ||
    sessionAttendee?.email === attendee.email;

  const attendeeGames = await getGamesForAttendee(
    attendee.eventSlug,
    attendee.slug
  );
  const games = await Promise.all(
    attendeeGames
      .filter((game) => game.published)
      .map(async (player) => {
        const opponent = (
          await getPlayersByTable(
            player.eventSlug,
            player.roundIndex,
            player.tableNumber
          )
        ).filter((g) => g.attendeeSlug !== player.attendeeSlug)[0];
        return { player, opponent };
      })
  );
  games.sort(sortBy(({ player }) => player.tableNumber));

  return json<LoaderData>({
    attendee: {
      ...attendee,
      email: "",
      ...(additionalFieldsPublic ? {} : { additionalFields: {} }),
      sportsBallot: {},
      paintBallot: {},
    },
    games,
    attendeesBySlug: await attendeeDisplayDataBySlug(tournament.slug),
  });
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }) => {
      const { attendee } = data ?? ({} as LoaderData);
      return attendee?.name ?? "Not Found";
    },
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  invariant(params.slug, "From route");

  const tournament = getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const attendee = await getSessionAttendee(request, params.eventId);
  if (!attendee || attendee.slug !== params.slug) {
    throw new Response("Not authorised", { status: 403 });
  }

  const formData = Object.fromEntries(await request.formData());
  const ballot = Object.fromEntries(
    Object.entries(formData).flatMap(([k, v]) => {
      const [, slug] = k.match(/^vote\[([^\]]+)]$/) || [];
      return slug && v.toString().match(/^\d+$/)
        ? [[slug, parseInt(v.toString())]]
        : [];
    })
  );

  if (formData.type === "paint") {
    attendee.paintBallot = ballot;
    await putAttendee(attendee);
  }

  if (formData.type === "sports") {
    attendee.sportsBallot = ballot;
    await putAttendee(attendee);
  }

  return null;
};

export default function LoginAsAttendeePage() {
  const { attendee, games, attendeesBySlug } = useLoaderData<
    typeof loader
  >() as LoaderData;

  const { tournament, currentAttendee } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  return (
    <>
      <h2>{attendee.name}</h2>
      {currentAttendee?.slug === attendee.slug && (
        <>
          <h3>Voting</h3>
          <div className="callout secondary">
            <p>
              <FiInfo /> These votes will only be visible to you.
            </p>
          </div>
          <PaintVotes
            attendee={currentAttendee}
            attendeesBySlug={attendeesBySlug}
          />
          <SportsVotes
            attendee={currentAttendee}
            games={games}
            attendeesBySlug={attendeesBySlug}
          />
        </>
      )}
      <dl>
        {tournament.additionalFields?.map((spec) => {
          return attendee.additionalFields?.[spec.name] ? (
            <Fragment key={spec.name}>
              <dt>{spec.label}</dt>
              <dd>
                {additionalFieldTypes[spec.type].profile(
                  attendee.additionalFields?.[spec.name],
                  attendee
                )}
              </dd>
            </Fragment>
          ) : null;
        })}
      </dl>
      {games.length ? (
        <>
          <h3>Games</h3>
          <table>
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Opponent</th>
                <th>Result</th>
                <th>Tournament points</th>
                <th>Total routed</th>
              </tr>
            </thead>
            <tbody>
              {games
                .sort(sortBy(({ player }) => player.roundIndex))
                .map(({ player, opponent }) => (
                  <tr key={player.roundIndex}>
                    <td>
                      <Link
                        to={`/event/${tournament.slug}/round/${
                          player.roundIndex + 1
                        }/table/${player.tableNumber}`}
                      >
                        {tournament.scenarios[player.roundIndex]?.scenario.name}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/event/${tournament.slug}/profile/${opponent.attendeeSlug}`}
                      >
                        {attendeesBySlug[opponent.attendeeSlug]?.name ??
                          opponent.attendeeSlug}
                        <br />
                        <small>
                          {attendeesBySlug[opponent.attendeeSlug]?.faction}
                        </small>
                      </Link>
                    </td>
                    <td>{player.outcome ?? "-"}</td>
                    <td>{player.totalScore ?? "-"}</td>
                    <td>{player.routedPoints ?? "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : null}
    </>
  );
}

export function ErrorBoundary() {
  return <GenericErrorPage />;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <ErrorPage heading="Attendee not found">
        <p>Sorry, there is no attendee matching the requested URL.</p>
      </ErrorPage>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
