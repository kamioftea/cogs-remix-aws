import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSessionId, getUser } from "~/account/session.server";
import { useUser } from "~/utils";
import type { Tournament } from "~/tournament/tournament-model.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { listTournamentAttendeesByEmail } from "~/tournament/attendee-model.server";
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
  if (!user) return redirect("/account/login");

  const attendees = await listTournamentAttendeesByEmail(user.email);
  const eventualSignUps: Promise<SignUp[]>[] = attendees.map(
    async (attendee): Promise<SignUp[]> => {
      const tournament = await getTournamentBySlug(attendee.eventSlug);
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
    },
  );

  const signUps = (await Promise.all(eventualSignUps)).flatMap((arr) => arr);

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
