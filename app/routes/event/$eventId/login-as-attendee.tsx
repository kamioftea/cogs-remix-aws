import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { validateAttendeeKey } from "~/account/auth.server";
import { createUserSession } from "~/account/session.server";
import { json, redirect } from "@remix-run/router";
import { putAttendee } from "~/tournament/attendee-model.server";
import { Form, Link, useLoaderData } from "@remix-run/react";
import * as React from "react";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect(`/event/${tournament.slug}/send-edit-link`);
  }

  const attendee = await validateAttendeeKey(request, tournament.slug);

  return json({ attendee });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");

  const attendee = await validateAttendeeKey(request, params.eventId);
  attendee.verified = true;
  await putAttendee(attendee);

  return createUserSession({
    request,
    email: attendee.email,
    redirectTo: `/event/${params.eventId}/edit-details`,
  });
};

export default function LoginAsAttendeePage() {
  const { attendee } = useLoaderData<typeof loader>();

  return (
    <>
      <Form method="post" className="credentials-form">
        <h2>Confirm login?</h2>
        <p>
          You are logging in as in as {attendee.name} &lt;{attendee.email}&gt;.
        </p>
        <p>
          <button type="submit" className="button primary">
            Continue
          </button>
        </p>
        <p>
          Don't want to login as this user?{" "}
          <Link to={"../"}>Go back to event page.</Link>
        </p>
      </Form>
    </>
  );
}
