import { Breadcrumbs } from "~/utils/breadcrumbs";
import type { LinksFunction } from "@remix-run/node";
import stylesheetUrl from "~/styles/index.css";
import React from "react";
import { Link } from "@remix-run/react";
import { FiChevronRight } from "react-icons/fi";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export default function MoonstoneCampaign() {
  return (
    <>
      <section role="banner" className="cogs-header margin-bottom-1">
        <img
          src="/_static/images/logo.png"
          alt="Chesterfield Open Gaming Society Logo"
          className="logo"
        />
        <span className="club-name">Chesterfield Open Gaming Society</span>
        <h1>Campaigns</h1>
      </section>

      <Breadcrumbs />

      <main>
        <div className="event-card-list">
          <Link
            to={`/campaign/moonstone`}
            aria-labelledby={`moonstone-find-out-more`}
          >
            <section aria-labelledby={`moonstone-heading`} className="event">
              <img
                src={`/_static/images/moonstone-campaign.png`}
                alt={"Moonstone campaign banner image"}
                role="presentation"
              />
              <h3 id="moonstone-heading" className="event-title">
                Into the Forsaken Forest
                <br />
                <small>A Moonstone escalation campaign</small>
              </h3>
              <button
                className="button more-info"
                id={`moonstone-find-out-more`}
                type="button"
                tabIndex={-1}
              >
                Into the Forsaken Forest campaign page
                <FiChevronRight />
              </button>
            </section>
          </Link>
        </div>
      </main>
    </>
  );
}
