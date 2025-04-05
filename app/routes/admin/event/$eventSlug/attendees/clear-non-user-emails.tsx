import { Link } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/router";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import {
  deleteAttendee,
  listTournamentAttendeesByEventSlug,
  putAttendee,
} from "~/tournament/attendee-model.server";
import { getUserByEmail } from "~/account/user-model.server";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ params }) => {
  const { eventSlug } = params;
  invariant(eventSlug, "From route");
  const tournament = await getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }

  const attendees = await listTournamentAttendeesByEventSlug(eventSlug);
  const users = await Promise.all(
    attendees.map(async (a) => (a.email ? getUserByEmail(a.email) : null)),
  );
  const userEmails = users.flatMap((u) => (u?.email != null ? [u.email] : []));
  await Promise.all(
    attendees
      .filter((a) => a.email !== a.slug && !userEmails.includes(a.email))
      .map((a) =>
        putAttendee({ ...a, email: a.slug }).then(() =>
          deleteAttendee(a.email, a.eventSlug),
        ),
      ),
  );

  return redirect(`/admin/event/${eventSlug}/attendees`);
};

export default () => {
  return (
    <>
      <h1>Clear Non-user emails</h1>
      <form method="POST">
        <legend>
          Are you sure you want to remove the email addresses of users who don't
          have an email?
        </legend>
        <button type="submit" className="button primary">
          Confirm
        </button>
      </form>
      <Link to={".."}>Cancel</Link>
    </>
  );
};
