import type { Breadcrumb } from "~/utils/breadcrumbs";
import { Breadcrumbs, CURRENT } from "~/utils/breadcrumbs";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import indexStylesheetUrl from "~/styles/index.css";
import eventStylesheetUrl from "~/styles/event.css";
import stylesheetUrl from "~/styles/campaign.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: indexStylesheetUrl },
    { rel: "stylesheet", href: eventStylesheetUrl },
    { rel: "stylesheet", href: stylesheetUrl },
  ];
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: "The Forest Depths",
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export const meta: MetaFunction = () => {
  let title =
    "The Forest Depths - a Moonstone campaign" +
    " | Organised play" +
    " | Chesterfield Open Gaming Society";
  return {
    title,
    "og:title": title,
    "og:description":
      "Starting 16th February 2026 Chesterfield Open Gaming Society will be running" +
      " a Moonstone gaming evening and campaign every fourth week",
    "og:image": "/_static/images/moonstone-campaign-2026-og.png",
    "og:image:alt":
      "Jayda shooting her bow in a thorny forest, whilst being" +
      " beset by fairies. The image is monochrome, except Jayda" +
      " and two prominent fairies are highlighted in Yellow.",
  };
};

export default function MoonstoneCampaign() {
  return (
    <>
      <header
        role="banner"
        className="event-banner"
        style={{
          backgroundImage: `url(/_static/images/moonstone-campaign.png)`,
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
            placeSelf: "end end",
            textAlign: "right",
            marginRight: "1.5rem",
          }}
        >
          <h1>The Forest Depths</h1>
          <p className="subtitle">A Moonstone campaign</p>
        </div>
      </header>

      <Breadcrumbs />

      <main>
        <Outlet />
      </main>

      <footer>
        <p className="disclaimer">
          Wolfsbane II font ©
          <a href="https://www.iconian.com/index.html">Iconian Fonts</a>{" "}
          licenced for non-commercial use.
        </p>
        <p className="disclaimer">
          Character stat cards and faction logos ©
          <a href="https://www.moonstonethegame.com/">Goblin King Games</a>.
        </p>
      </footer>
    </>
  );
}
