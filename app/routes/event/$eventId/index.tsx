import {
  Link,
  useCatch,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import { Fragment } from "react";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { TournamentLoaderData } from "~/routes/event/$eventId";
import { AiOutlineFilePdf } from "react-icons/ai";
import { useOptionalUser } from "~/utils";
import { json, LoaderFunction } from "@remix-run/router";
import { getTournamentAttendees } from "~/tournament/attendee-model.server";
import invariant from "tiny-invariant";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { getUser } from "~/account/session.server";

interface LoaderData {
  attendees: { name: string; paid: boolean }[];
  waitList: string[];
  userSignedUp: boolean;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  const user = await getUser(request);
  const attendees = (await getTournamentAttendees(params.eventId)).sort(
    (a, b) => a.created.getTime() - b.created.getTime()
  );
  const userSignedUp = !!user && attendees.some((a) => a.email === user.email);

  return json<LoaderData>({
    attendees: attendees
      .slice(0, 20)
      .filter((a) => a.verified)
      .map((a) => ({ name: a.name, paid: a.paid })),
    waitList: attendees
      .slice(20)
      .filter((a) => a.verified)
      .map((a) => a.name),
    userSignedUp,
  });
};

export default function EventLandingPage() {
  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  const { attendees, waitList, userSignedUp } = useLoaderData<
    typeof loader
  >() as LoaderData;
  const user = useOptionalUser();

  return (
    <div className="right-aside">
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
                  <Link to={"./send-edit-link"}>
                    Request a link to edit your details
                  </Link>
                  .
                </p>
              )}
            </>
          )}
          <h2>Attendees</h2>
          <div className="callout warning">
            <h3>
              <FiAlertCircle /> Email verification delayed
            </h3>
            <p>
              Sign ups will not show below until your email address has been
              verified. This verification process relies on sending an email to
              the address you registered with. We're waiting on approval from
              our email provider to send these emails. This should be within 24
              hours so by end of Monday 30th January.
            </p>
            <p>
              Don't worry that nothing is showing. If you reached the
              registration requested page, your place is secured.
            </p>
          </div>
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
                  <td>{attendee.name}</td>
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
      {tournament.content && (
        <div dangerouslySetInnerHTML={{ __html: tournament.content }} />
      )}
    </div>
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
