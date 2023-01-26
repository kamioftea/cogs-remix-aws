import { Link, Outlet, useRouteLoaderData } from "@remix-run/react";
import { TournamentLoaderData } from "~/routes/event/$eventId";
import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { slugify } from "~/utils/slugify";
import stylesheetUrl from "~/styles/side-nav.css";
import { PackSectionLoaderData } from "~/routes/event/$eventId/pack/$sectionSlug";
import { Breadcrumb, CURRENT } from "~/utils/breadcrumbs";
import { FiChevronLeft } from "react-icons/fi";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament || !tournament.rulesPack) {
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

  invariant(tournament.rulesPack);
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
        {tournament.rulesPack.map(({ title, slug = slugify(title) }) => (
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
