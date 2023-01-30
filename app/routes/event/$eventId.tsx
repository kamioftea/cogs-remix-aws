import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Tournament } from "~/tournament/tournament-model.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import invariant from "tiny-invariant";
import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import stylesheetUrl from "~/styles/event.css";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { Breadcrumb, Breadcrumbs, CURRENT } from "~/utils/breadcrumbs";

export interface TournamentLoaderData {
  tournament: Tournament;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  return json<TournamentLoaderData>({ tournament });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const meta: MetaFunction = ({ data }) => {
  const tournament = data.tournament as Tournament;

  return {
    "og:description": tournament.description,
    "og:image": tournament.openGraph.imageUrl,
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
          style={{ marginLeft: tournament.titlePosition ?? "0" }}
        >
          <h1>{tournament.title}</h1>
          <p className="subtitle">{tournament.subtitle}</p>
        </div>
      </header>

      <Breadcrumbs />

      <main>
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

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

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
