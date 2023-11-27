import type { LoaderFunction } from "@remix-run/router";
import { json } from "@remix-run/router";
import type {
  AttendeeDisplayData} from "~/tournament/attendee-model.server";
import {
  attendeeDisplayDataBySlug,
  listTournamentAttendeesByEventSlug,
} from "~/tournament/attendee-model.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { sortBy } from "~/utils";

interface LoaderData {
  attendees: Record<string, AttendeeDisplayData>;
  sportsVotes: Record<string, number>;
  paintVotes: Record<string, number>;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventSlug, "eventId not found");

  const attendees = await listTournamentAttendeesByEventSlug(params.eventSlug);
  const paintVotes = attendees
    .flatMap((attendee) => Object.entries(attendee.paintBallot ?? {}))
    .reduce<Record<string, number>>(
      (acc, [slug, votes]) => ({
        ...acc,
        [slug]: (acc[slug] ?? 0) + votes,
      }),
      {}
    );
  const sportsVotes = attendees
    .flatMap((attendee) => Object.entries(attendee.sportsBallot ?? {}))
    .reduce<Record<string, number>>(
      (acc, [slug, votes]) => ({
        ...acc,
        [slug]: (acc[slug] ?? 0) + votes,
      }),
      {}
    );

  return json<LoaderData>({
    attendees: await attendeeDisplayDataBySlug(params.eventSlug),
    paintVotes,
    sportsVotes,
  });
};

export default function VotesPage() {
  const { attendees, paintVotes, sportsVotes } = useLoaderData<
    typeof loader
  >() as LoaderData;
  const paintRanking = useMemo(
    () =>
      Object.entries(paintVotes).sort(
        sortBy(
          ([, v]) => -v,
          ([k]) => k
        )
      ),
    [paintVotes]
  );

  const sportRanking = useMemo(
    () =>
      Object.entries(sportsVotes).sort(
        sortBy(
          ([, v]) => -v,
          ([k]) => k
        )
      ),
    [sportsVotes]
  );

  // TODO: persist
  const raffle = useMemo(
    () =>
      [...Object.values(attendees)]
        .sort(sortBy(() => Math.random()))
        .slice(0, 3),
    [attendees]
  );

  return (
    <>
      <h3>Best Army</h3>
      <ul>
        {paintRanking.map(([slug, votes]) => (
          <li key={slug}>
            {attendees[slug]?.name ?? slug}: {votes}
          </li>
        ))}
      </ul>
      <h3>Best Sports</h3>
      <ul>
        {sportRanking.map(([slug, votes]) => (
          <li key={slug}>
            {attendees[slug]?.name ?? slug}: {votes}
          </li>
        ))}
      </ul>
      <h3>Raffle</h3>
      <ul>
        {raffle.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </>
  );
}
