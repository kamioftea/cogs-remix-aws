import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { Tournament } from "~/tournament/tournament-model.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import type { LoaderFunction } from "@remix-run/router";
import { json } from "@remix-run/router";
import invariant from "tiny-invariant";
import { Fragment } from "react";

interface LoaderData {
  tournament: Tournament;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventSlug);
  const tournament = await getTournamentBySlug(params.eventSlug);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  return json<LoaderData>({ tournament });
};

export default function EventLayout() {
  const { tournament } = useLoaderData<typeof loader>() as LoaderData;

  return (
    <>
      <nav>
        <Link to={`/event/${tournament.slug}`}>Event page</Link> |{" "}
        <Link to={`/admin/event/${tournament.slug}/attendees`}>Attendees</Link>{" "}
        |{" "}
        {!tournament.listsSubmissionClosed ? (
          <>
            <Link
              to={`/admin/event/${tournament.slug}/attendees/send-list-submission-reminders`}
            >
              Send reminders
            </Link>{" "}
            |{" "}
          </>
        ) : null}
        {tournament.scenarios.map(({ scenario }, index) => (
          <Fragment key={scenario.name}>
            <Link to={`/admin/event/${tournament.slug}/round/${index + 1}`}>
              Round {index + 1}: {scenario.name}
            </Link>{" "}
            |{" "}
          </Fragment>
        ))}
        <Link to={`/admin/event/${tournament.slug}/votes`}>Votes</Link> |{" "}
        <a
          href={`/admin/event/${tournament.slug}/masters-csv`}
          target="_blank"
          rel="noreferrer"
          download={`${tournament.slug}-final-standings.csv`}
        >
          Download Results Submission
        </a>{" "}
        |{" "}
        <a
          href={`/admin/event/${tournament.slug}/masters-zip`}
          target="_blank"
          rel="noreferrer"
          download={`${tournament.slug}-lists.zip`}
        >
          Download Lists
        </a>{" "}
        |{" "}
        <Link
          to={`/admin/event/${tournament.slug}/attendees/clear-non-user-emails`}
        >
          Clear non-user emails
        </Link>
      </nav>
      <Outlet />
    </>
  );
}
