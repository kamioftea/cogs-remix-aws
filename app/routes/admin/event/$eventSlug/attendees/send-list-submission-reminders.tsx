import { Link } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/router";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { listTournamentAttendeesByEventSlug } from "~/tournament/attendee-model.server";
import { redirect } from "@remix-run/node";
import { sendEmail } from "~/utils/send-email.server";
import { ListSubmissionReminderEmail } from "~/tournament/list-submission-reminder-email";
import { getAttendeeKey } from "~/account/auth.server";

export const action: ActionFunction = async ({ params }) => {
  const { eventSlug } = params;
  invariant(eventSlug, "From route");
  const tournament = getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }

  const attendees = await listTournamentAttendeesByEventSlug(eventSlug);

  await Promise.all(
    attendees
      .filter(
        (attendee) =>
          !attendee.additionalFields?.army_list && attendee.verified,
      )
      .map(async (attendee) =>
        sendEmail(
          new ListSubmissionReminderEmail(
            attendee.name,
            attendee.email,
            eventSlug,
            tournament.title,
            tournament.date,
            await getAttendeeKey(attendee.email, tournament.slug),
          ),
        ),
      ),
  );

  return redirect(`/admin/event/${eventSlug}/attendees`);
};

export default () => {
  return (
    <>
      <h1>Send list submission reminder emails</h1>
      <form method="POST">
        <legend>
          Are you sure you want to send a reminder email to attendees without a
          submitted list?
        </legend>
        <button type="submit" className="button primary">
          Confirm
        </button>
      </form>
      <Link to={".."}>Cancel</Link>
    </>
  );
};
