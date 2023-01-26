import { Link, useCatch, useRouteLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { TournamentLoaderData } from "~/routes/event/$eventId";
import { AiOutlineFilePdf } from "react-icons/ai";

export default function EventLandingPage() {
  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  return (
    <>
      <aside className="summary-box">
        <p>{tournament.description}</p>
        {tournament.rulesPack && (
          <p>
            <Link to={"./pack"}>Read the event pack online.</Link>
          </p>
        )}
        {tournament.rulesPdfUrl && (
          <p>
            <a
              href={`${tournament.rulesPdfUrl.base}${tournament.rulesPdfUrl.name}`}
              download={tournament.rulesPdfUrl.name}
              className="button primary hollow expanded"
            >
              <AiOutlineFilePdf /> Download the event pack in PDF format.
            </a>
          </p>
        )}
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
