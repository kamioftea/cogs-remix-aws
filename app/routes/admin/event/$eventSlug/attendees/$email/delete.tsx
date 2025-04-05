import type { ActionFunction, LoaderFunction } from "@remix-run/router";
import { redirect } from "@remix-run/router";
import {
  deleteAttendee,
  getTournamentAttendee,
} from "~/tournament/attendee-model.server";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";

export const action: ActionFunction = async ({ params }) => {
  const { eventSlug, email } = params;
  invariant(eventSlug && email, "From route");
  const tournament = await getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament attendee not found", { status: 404 });
  }

  const attendee = await getTournamentAttendee(eventSlug, email);
  if (!attendee) {
    throw new Response("Event attendee not found", { status: 404 });
  }

  await deleteAttendee(attendee.email, attendee.eventSlug);

  return redirect(`/admin/event/${eventSlug}/attendees`);
};

export const loader: LoaderFunction = () => {
  throw new Response("Method not supported", { status: 405 });
};
