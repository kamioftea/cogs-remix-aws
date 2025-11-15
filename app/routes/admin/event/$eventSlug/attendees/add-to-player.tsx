import type { ActionFunction } from "@remix-run/router";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { createAttendee } from "~/tournament/attendee-model.server";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ params }) => {
  const { eventSlug } = params;
  invariant(eventSlug, "From route");
  const tournament = await getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }
  if (!tournament.lowAttendeesPlayer) {
    throw new Response("No TO configured", { status: 400 });
  }

  await createAttendee({
    eventSlug: tournament.slug,
    name: tournament.lowAttendeesPlayer.name,
    email: tournament.lowAttendeesPlayer.email,
    approved: true,
    verified: true,
  });

  return redirect(`/admin/event/${eventSlug}/attendees`);
};
