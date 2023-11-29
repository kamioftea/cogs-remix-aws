import type { ActionFunction, LoaderFunction } from "@remix-run/router";
import { redirect } from "@remix-run/router";
import {
  getTournamentAttendee,
  putAttendee,
} from "~/tournament/attendee-model.server";
import invariant from "tiny-invariant";
import { sendEmail } from "~/utils/send-email.server";
import { VerifyAttendeeEmail } from "~/tournament/verify-attendee-email";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { getAttendeeKey } from "~/account/auth.server";

export const action: ActionFunction = async ({ params }) => {
  const { eventSlug, email } = params;
  invariant(eventSlug && email, "From route");
  const tournament = getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }

  const attendee = await getTournamentAttendee(eventSlug, email);
  if (!attendee) {
    throw new Response("Event attendee not found", { status: 404 });
  }

  attendee.approved = true;
  await putAttendee(attendee);

  const accessKey = await getAttendeeKey(attendee.email, eventSlug);
  await sendEmail(
    new VerifyAttendeeEmail(
      attendee.name,
      attendee.email,
      eventSlug,
      tournament.title,
      accessKey,
    ),
  );

  return redirect(`/admin/event/${eventSlug}/attendees`);
};

export const loader: LoaderFunction = () => {
  throw new Response("Method not supported", { status: 405 });
};
