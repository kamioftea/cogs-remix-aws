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
    label: "Moonstone",
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export const meta: MetaFunction = () => {
  let title =
    "Into the Forsaken Forest - a Moonstone escalation campaign" +
    " | Organised play" +
    " | Chesterfield Open Gaming Society";
  return {
    title,
    "og:title": title,
    "og:description":
      "Starting January 2025 Chesterfield Open Gaming Society will be running" +
      " a Moonstone gaming evening and escalation campaign on the 2nd" +
      " Monday of each month.",
    "og:image": "/_static/images/moonstone-campaign-og.png",
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
          <h1>
            Into the
            <br />
            Forsaken Forest
          </h1>
          <p className="subtitle">A Moonstone escalation campaign</p>
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
