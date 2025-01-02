import type { ActionFunction } from "@remix-run/router";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { createAttendee } from "~/tournament/attendee-model.server";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ params }) => {
  const { eventSlug } = params;
  invariant(eventSlug, "From route");
  const tournament = getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }
  if (!tournament.sparePlayer) {
    throw new Response("No spare player configured", { status: 400 });
  }

  await createAttendee({
    eventSlug: tournament.slug,
    name: tournament.sparePlayer.name,
    email: tournament.sparePlayer.email,
    approved: true,
    verified: true,
  });

  return redirect(`/admin/event/${eventSlug}/attendees`);
};
