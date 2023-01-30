import {
  getTournamentBySlug,
  Tournament,
} from "~/tournament/tournament-model.server";
import { json, LoaderFunction } from "@remix-run/router";
import { Link } from "@remix-run/react";
import invariant from "tiny-invariant";

interface LoaderData {
  tournament: Tournament;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventSlug);
  const tournament = getTournamentBySlug(params.eventSlug);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  return json<LoaderData>({ tournament });
};

export default function EventIndexPage() {
  return (
    <>
      <Link to={"./attendees"}>Attendees</Link>
    </>
  );
}
