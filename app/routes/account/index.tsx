import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSessionId, getUser } from "~/account/session.server";
import { useUser } from "~/utils";
import type { Tournament } from "~/tournament/tournament-model.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { getTournamentAttendeesByEmail } from "~/tournament/attendee-model.server";
import invariant from "tiny-invariant";
import { Link, useLoaderData } from "@remix-run/react";

type PaymentStatus = "Paid" | "Unpaid" | "Free";

type SignUp = {
  title: Tournament["title"];
  slug: Tournament["slug"];
  paymentStatus: PaymentStatus;
};

interface LoaderData {
  signUps: SignUp[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const sessionId = await getSessionId(request);
  if (!sessionId) return redirect("/account/login");

  const user = await getUser(request);
  invariant(user, "checked for session id");

  const attendees = await getTournamentAttendeesByEmail(user.email);
  const signUps: SignUp[] = attendees.flatMap((attendee) => {
    const tournament = getTournamentBySlug(attendee.eventSlug);
    if (!tournament) {
      return [];
    }
    return [
      {
        title: tournament.title,
        slug: attendee.eventSlug,
        paymentStatus: tournament.costInPounds
          ? attendee.paid
            ? "Paid"
            : "Unpaid"
          : "Free",
      },
    ];
  });

  return json<LoaderData>({ signUps });
};

export default function AccountIndexPage() {
  const user = useUser();
  const { signUps } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>Profile</h2>
      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>

        <dt>Name</dt>
        <dd>{user.name}</dd>
      </dl>
      {signUps.length > 0 && (
        <>
          <h2>Sign ups</h2>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Paid?</th>
              </tr>
            </thead>
            <tbody>
              {signUps.map((signUp) => (
                <tr key={signUp.slug}>
                  <td>
                    <Link to={`/event/${signUp.slug}`}>{signUp.title}</Link>
                  </td>
                  <td>{signUp.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
