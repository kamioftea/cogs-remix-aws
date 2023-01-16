import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  getTournamentBySlug,
  Tournament,
} from "~/tournament/tournament-model.server";
import invariant from "tiny-invariant";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import stylesheetUrl from "~/styles/event.css";
import { Fragment } from "react";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";

interface LoaderData {
  tournament: Tournament;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  return json<LoaderData>({ tournament });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export default function EventLandingPage() {
  const { tournament } = useLoaderData<LoaderData>();

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

      <nav aria-label="You are here:" role="navigation">
        <ul className="breadcrumbs">
          <li>
            <a href="https://www.c-o-g-s.org.uk/">Home</a>
          </li>
          <li>
            <Link to="/">Kings of War</Link>
          </li>
          <li className="">Events</li>
          <li>
            <span className="show-for-sr">Current: </span> {tournament.title}
          </li>
        </ul>
      </nav>

      <main>
        <aside className="summary-box">
          <p>{tournament.description}</p>
          {tournament.about && (
            <dl>
              {Object.entries(tournament.about).map(([label, items]) => (
                <Fragment key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {items.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </dd>
                </Fragment>
              ))}
            </dl>
          )}
        </aside>
        <div dangerouslySetInnerHTML={{ __html: tournament.content }} />
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
