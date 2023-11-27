import { useRouteLoaderData } from "@remix-run/react";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import { AiOutlineFilePdf } from "react-icons/ai";
import { Fragment } from "react";

export default function EventPackLandingPage() {
  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  return (
    <>
      <h2>Event pack</h2>
      {tournament.eventPackPdfUrl && (
        <p>
          <a
            href={`${tournament.eventPackPdfUrl.base}${tournament.eventPackPdfUrl.name}`}
            download={tournament.eventPackPdfUrl.name}
            className="button primary hollow"
          >
            <AiOutlineFilePdf /> Download the event pack in PDF format.
          </a>
        </p>
      )}
      <p className="lead">{tournament.description}</p>
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
    </>
  );
}
