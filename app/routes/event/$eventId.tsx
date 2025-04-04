import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Tournament } from "~/tournament/tournament-model.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import invariant from "tiny-invariant";
// noinspection JSDeprecatedSymbols
import { Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import stylesheetUrl from "~/styles/event.css";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { Breadcrumbs, CURRENT } from "~/utils/breadcrumbs";
import { getSessionAttendee } from "~/account/session.server";
import type { Attendee } from "~/tournament/attendee-model.server";
import dayjs from "dayjs";

import advancedFormat from "dayjs/plugin/advancedFormat";
import { useOptionalUser } from "~/utils";
import { Role } from "~/account/user-model";
import { Fragment } from "react";
dayjs.extend(advancedFormat);

export interface TournamentLoaderData {
  tournament: Tournament;
  currentAttendee: Attendee | null;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const currentAttendee = await getSessionAttendee(request, tournament.slug);

  return json<TournamentLoaderData>({ tournament, currentAttendee });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const meta: MetaFunction = ({ data }) => {
  const tournament = data.tournament as Tournament;

  return {
    title: `${tournament.title} | Organised play | Chesterfield Open Gaming Society`,
    "og:title": `${tournament.title} | Organised play | Chesterfield Open Gaming Society`,
    "og:description": tournament.description,
    "og:image": tournament.openGraph.imageUrl,
    "og:image:alt": tournament.openGraph.imageAlt,
    ...(tournament.openGraph.imageType
      ? { "og:image:type": tournament.openGraph.imageType }
      : {}),
  };
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }) => {
      const { tournament } = data as TournamentLoaderData;
      return tournament.title;
    },
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export default function EventLandingPage() {
  const { tournament } = useLoaderData<TournamentLoaderData>();
  const user = useOptionalUser();

  return (
    <>
      <header
        role="banner"
        className="event-banner"
        style={{
          backgroundImage: `url(/_static/images/${tournament.imageUrl})`,
        }}
      >
        <img
          src="/_static/images/logo.png"
          alt="Chesterfield Open Gaming Society Logo"
          className="logo"
        />
        <span className="h3 club-name">
          Chesterfield Open Gaming Society Presents
        </span>
        <div
          className="title-wrapper"
          style={{
            marginLeft: tournament.titlePositionX ?? "0",
            ...(tournament.titleStyles ?? {}),
          }}
        >
          <h1>{tournament.title}</h1>
          <p className="subtitle">{tournament.subtitle}</p>
          {tournament.date && (
            <p className="date-line">
              {dayjs(tournament.date).format("Do MMMM YYYY")}
            </p>
          )}
        </div>
      </header>

      <Breadcrumbs />

      <main>
        {user?.roles?.includes(Role.Admin) && (
          <div className="callout warning">
            Admin:{" "}
            <Link to={`/admin/event/${tournament.slug}/attendees`}>
              Attendees
            </Link>{" "}
            |{" "}
            {tournament.scenarios.map(({ scenario }, index) => (
              <Fragment key={scenario.name}>
                <Link to={`/admin/event/${tournament.slug}/round/${index + 1}`}>
                  Round {index + 1}: {scenario.name}
                </Link>{" "}
                |{" "}
              </Fragment>
            ))}
            <Link to={`/admin/event/${tournament.slug}/votes`}>Votes</Link>
          </div>
        )}
        <Outlet />
      </main>

      <footer>
        {tournament.disclaimer && (
          <p
            className="disclaimer"
            dangerouslySetInnerHTML={{ __html: tournament.disclaimer }}
          />
        )}
        <p className="disclaimer">
          Wolfsbane II font ©
          <a href="https://www.iconian.com/index.html">Iconian Fonts</a>{" "}
          licenced for non-commercial use.
        </p>
      </footer>
    </>
  );
}

export function ErrorBoundary() {
  return <GenericErrorPage />;
}

export function CatchBoundary() {
  // noinspection JSDeprecatedSymbols
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
