import {
  Link,
  useCatch,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import type { ReactNode } from "react";
import { Fragment } from "react";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import { AiOutlineFilePdf } from "react-icons/ai";
import { sortBy, useOptionalUser } from "~/utils";
import type { LoaderFunction } from "@remix-run/router";
import { json } from "@remix-run/router";
import { listTournamentAttendeesByEventSlug } from "~/tournament/attendee-model.server";
import invariant from "tiny-invariant";
import { FiCheckCircle } from "react-icons/fi";
import { getSessionAttendee, getUser } from "~/account/session.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";

interface LoaderData {
  attendees: {
    name: string;
    paid: boolean;
    verified: boolean;
    slug: string;
    tournament_points: number;
    total_routed: number;
    total_attrition: number;
  }[];
  waitList: string[];
  userSignedUp: boolean;
  loggedIn: boolean;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  const tournament = getTournamentBySlug(params.eventId);
  invariant(tournament, "Checked in ../$eventId");
  const currentAttendee = await getSessionAttendee(request, tournament.slug);
  const user = await getUser(request);
  const attendees = await listTournamentAttendeesByEventSlug(params.eventId);
  const userSignedUp = !!currentAttendee;
  const loggedIn = !!currentAttendee || !!user;

  return json<LoaderData>({
    attendees: attendees
      .slice(0, tournament.maxAttendees ?? attendees.length)
      .filter((a) => a.approved)
      .map(({ name, paid, verified, slug, additionalFields }) => ({
        name,
        paid,
        verified,
        slug,
        tournament_points: parseInt(additionalFields?.tournament_points ?? "0"),
        total_routed: parseInt(additionalFields?.total_routed ?? "0"),
        total_attrition: parseInt(additionalFields?.total_attrition ?? "0"),
      })),
    waitList: attendees
      .slice(tournament.maxAttendees ?? attendees.length)
      .filter((a) => a.approved)
      .map((a) => a.name),
    userSignedUp,
    loggedIn,
  });
};

export default function EventLandingPage() {
  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  const { attendees, waitList, userSignedUp, loggedIn } = useLoaderData<
    typeof loader
  >() as LoaderData;
  const user = useOptionalUser();

  return (
    <div className="right-aside">
      <aside className="summary-box">
        <p>{tournament.description}</p>
        {tournament.eventPack && (
          <p>
            <Link to={"./pack"}>Read the event pack online.</Link>
          </p>
        )}
        {tournament.eventPackPdfUrl && (
          <p>
            <a
              href={`${tournament.eventPackPdfUrl.base}${tournament.eventPackPdfUrl.name}`}
              download={tournament.eventPackPdfUrl.name}
              className="button primary hollow expanded"
            >
              <AiOutlineFilePdf /> Download the event pack PDF.
            </a>
          </p>
        )}
        {tournament.scenarioPdfUrl && (
          <p>
            <a
              href={`${tournament.scenarioPdfUrl.base}${tournament.scenarioPdfUrl.name}`}
              download={tournament.scenarioPdfUrl.name}
              className="button primary hollow expanded"
            >
              <AiOutlineFilePdf /> Download the scoring pack PDF.
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
        {tournament.kowMastersEventId && <p>
          <a href={`https://kowmasters.com/index.php?p=event&i=${tournament.kowMastersEventId}`}>
            KoW Masters event page.
          </a>
        </p>}
        {tournament.manticCompanionEventId && <p>
          <a href={`https://companion.manticgames.com/kings-of-war-events/?event=${tournament.manticCompanionEventId}`}>
            Mantic companion event page.
          </a>
        </p>}
      </aside>
      {tournament.signUpEnabled && (
        <div className="content">
          <h2>Sign up</h2>
          {userSignedUp ? (
            <p>
              You have already signed up for {tournament.title}. You can{" "}
              <a href={`/event/${tournament.slug}/edit-details`}>
                edit your details
              </a>
              .
            </p>
          ) : (
            <>
              <p>
                <Link to="./sign-up" className="button primary">
                  Sign Up for {tournament.title}
                </Link>
              </p>
              {!user && (
                <p>
                  Already signed up?{" "}
                  <Link to={"/account/login"}>Login</Link> or{" "}
                  <Link to={"./send-edit-link"}>
                    Request a link to edit your details
                  </Link>
                  .
                </p>
              )}
            </>
          )}
          <h2>Attendees</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee, i) => (
                <tr key={i}>
                  <td>
                    <Link
                      to={`/event/${tournament.slug}/profile/${attendee.slug}`}
                    >
                      {attendee.name}
                    </Link>
                  </td>
                  <td>
                    {attendee.paid && (
                      <span className="text-success">
                        <FiCheckCircle /> Paid
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {attendees.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center">
                    No signups yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {waitList.length > 0 && (
            <>
              <h2>Wait list</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {waitList.map((name, i) => (
                    <tr key={i}>
                      <td>{name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
      {tournament.listsSubmissionClosed && (
        <div className="content">
          {userSignedUp && (
            <>
              You are attending this tournament. You can{" "}
              <Link to={`/event/${tournament.slug}/edit-details`}>
                edit your details.
              </Link>
            </>
          )}
          {!userSignedUp && !loggedIn && (
            <>
              If you are attending this tournament you can{" "}
              <Link to={`/event/${tournament.slug}/send-edit-link`}>
                request a link to sign-in
              </Link>
              .
            </>
          )}
          <h2>Rounds</h2>
          {tournament.scenarios.map((scenario, index) => (
            <Link
              key={index}
              to={`/event/${tournament.slug}/round/${index + 1}`}
              className="button primary hollow expanded"
            >
              Round {index + 1}: {scenario.scenario.name}
            </Link>
          ))}
          <h2>Standings</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Tournament Points</th>
                <th>Total Routed</th>
              </tr>
            </thead>
            <tbody>
              {
                attendees
                  .sort(
                    sortBy(
                      (a) => -a.tournament_points,
                      (a) => -a.total_routed,
                      (a) => a.total_attrition,
                      (a) => a.name
                    )
                  )
                  .reduce<{
                    prev_tp: number;
                    prev_tr: number;
                    index: number;
                    rows: ReactNode[];
                  }>(
                    ({ prev_tp, prev_tr, index, rows }, attendee) => {
                      const position =
                        prev_tp === (attendee.tournament_points || 0) &&
                        prev_tr === (attendee.total_routed || 0)
                          ? ""
                          : index + 1;

                      return {
                        prev_tp: attendee.tournament_points || 0,
                        prev_tr: attendee.total_routed || 0,
                        index: index + 1,
                        rows: [
                          ...rows,
                          <tr key={attendee.slug}>
                            <td>{position}</td>
                            <td>
                              <Link
                                to={`/event/${tournament.slug}/profile/${attendee.slug}`}
                              >
                                {attendee.name}
                              </Link>
                            </td>
                            <td>{attendee.tournament_points ?? 0}</td>
                            <td>{attendee.total_routed ?? 0}</td>
                          </tr>,
                        ],
                      };
                    },
                    {
                      prev_tp: -1,
                      prev_tr: -1,
                      index: 0,
                      rows: [],
                    }
                  ).rows
              }
            </tbody>
          </table>
        </div>
      )}
      {tournament.content && (
        <div dangerouslySetInnerHTML={{ __html: tournament.content }} />
      )}
    </div>
  );
}

export function ErrorBoundary() {
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
