import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { useCatch } from "@remix-run/react";
import { listTournamentAttendeesByEventSlug } from "~/tournament/attendee-model.server";
import { sortBy } from "~/utils";
import type {
  GameOutcome} from "~/tournament/player-game-model.server";
import {
  getGamesForAttendee,
} from "~/tournament/player-game-model.server";

function toCSVCell(contents: string | number | undefined = ""): string {
  if (contents.toString().match(/[",\n]/m)) {
    return `"${contents.toString().replace(/"/g, '""')}"`;
  }

  return contents.toString();
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventSlug, "From route");

  const tournament = getTournamentBySlug(params.eventSlug);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  if (!tournament.kowMastersEventId) {
    throw new Response("Event missing masters id", { status: 500 });
  }

  const attendees = await listTournamentAttendeesByEventSlug(params.eventSlug);

  const rows = await Promise.all(
    attendees
      .sort(
        sortBy(
          (a) => -parseInt(a.additionalFields?.tournament_points || "0"),
          (a) => -parseInt(a.additionalFields?.total_routed || "0"),
          (a) => parseInt(a.additionalFields?.total_attrition || "0")
        )
      )
      .map(async (attendee, index) => {
        const games = await getGamesForAttendee(tournament.slug, attendee.slug);
        const outcomes = games.reduce<Record<GameOutcome, number>>(
          (acc, { outcome }) =>
            outcome ? { ...acc, [outcome]: acc[outcome] + 1 } : acc,
          { Win: 0, Draw: 0, Loss: 0 }
        );

        return [
          index + 1,
          attendee.name,
          attendee.additionalFields?.["faction"] ?? "",
          attendee.additionalFields?.["allies"] ?? "",
          outcomes["Win"],
          outcomes["Draw"],
          outcomes["Loss"],
          attendee.additionalFields?.["total_routed"],
          `https://kow.c-o-g-s.org.uk/event/${tournament.slug}/profile/${attendee.slug}/army-list`,
          ...[
            ...(attendee.additionalFields?.["awards"] ?? "").split(/\s*,\s*/),
            ...["", ""],
          ].slice(0, 3),
        ]
          .map(toCSVCell)
          .join(",");
      })
  );

  const body = `KoW Masters Results Submission Form,,,,,,,,,,,
Event ID,${tournament.kowMastersEventId},,,,,,,,,,
Event Name,${tournament.title},,,,,,,,,,
,,,,,,,,,,,
,,,,,,,,,Awards (non-podium),,
Rank,Player Name,Faction,Allies,Wins,Draws,Losses,Kill Points,Army List,Award 1,Award 2,Award 3
${rows.join("\n")}
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${tournament.slug}-final-standings.csv"`,
    },
  });
};

export function ErrorBoundary() {
  return <GenericErrorPage />;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <ErrorPage heading="Event not found">
        <p>Sorry, there is no active event matching the requested URL.</p>
      </ErrorPage>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
