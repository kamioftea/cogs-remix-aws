import { Link, Outlet, useCatch, useRouteLoaderData } from "@remix-run/react";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { slugify } from "~/utils/slugify";
import stylesheetUrl from "~/styles/side-nav.css";
import type { PackSectionLoaderData } from "~/routes/event/$eventId/pack/$sectionSlug";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import { FiChevronLeft } from "react-icons/fi";
import { GenericErrorPage } from "~/error-handling/error-page";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament || !tournament.eventPack) {
    throw new Response("No online rules pack for this event", { status: 404 });
  }

  return json({});
};

const breadcrumbs: Breadcrumb[] = [{ label: "Event Pack", url: CURRENT }];

export const handle = { breadcrumbs };

export default function EventPackLayout() {
  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  const sectionData = useRouteLoaderData(
    "routes/event/$eventId/pack/$sectionSlug"
  ) as PackSectionLoaderData | undefined;

  invariant(tournament.eventPack);
  const current = sectionData
    ? sectionData.section.slug ?? slugify(sectionData.section.title)
    : null;

  return (
    <>
      <nav className="side-navigation" aria-label="Event pack sections">
        <Link
          to={`./`}
          className={`button primary ${current != null && "hollow"} expanded`}
          preventScrollReset
        >
          Event pack
        </Link>
        {tournament.eventPack.map(({ title, slug = slugify(title) }) => (
          <div key={slug}>
            <Link
              to={`./${slug}`}
              className={`button primary ${
                current !== slug && "hollow"
              } expanded`}
              preventScrollReset
            >
              {title}
            </Link>
          </div>
        ))}
      </nav>
      <div className="page-content">
        <p>
          <Link to="../">
            <FiChevronLeft /> Back to event page
          </Link>
        </p>
        <Outlet />
      </div>
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
      <div className="span-nav">
        <h2>Rules pack not available</h2>
        <p>The rules pack for this event is not available yet.</p>
        <Link to={'..'}>Back to event page.</Link>
      </div>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
