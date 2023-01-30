import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import * as React from "react";
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import { getAttendeeKey, validateAttendeeKey } from "~/account/auth.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import invariant from "tiny-invariant";
import { Attendee, putAttendee } from "~/tournament/attendee-model.server";
import { TournamentLoaderData } from "~/routes/event/$eventId";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

interface LoaderData {
  attendee: Attendee;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  const tournament = getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const attendee = await validateAttendeeKey(request, tournament.slug);
  return json<LoaderData>({ attendee });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");

  const attendee = await validateAttendeeKey(request, params.eventId);
  attendee.verified = true;
  await putAttendee(attendee);

  const editURL = new URL(`${BASE_URL}/event/${params.eventId}/edit-details`);
  const accessKey = await getAttendeeKey(attendee.email, params.eventId);
  editURL.searchParams.set("token", accessKey);

  return redirect(editURL.toString());
};

export default function VerifyAttendeePage() {
  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  const { attendee } = useLoaderData<typeof loader>();

  return (
    <>
      <Form method="post" className="credentials-form">
        <h2>Confirm email</h2>
        <p>
          This will confirm that {attendee.name} &lt;{attendee.email}&gt; is
          attending ${tournament.title}
        </p>
        <p>
          <button type="submit" className="button primary">
            Confirm
          </button>
        </p>
        <p>
          Don't want to attend? <Link to={"../"}>Go back to event page.</Link>
        </p>
      </Form>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.data.heading && caught.data.message) {
    return (
      <ErrorPage heading={caught.data.heading}>
        <div dangerouslySetInnerHTML={{ __html: caught.data.message }} />
      </ErrorPage>
    );
  }

  return <GenericErrorPage />;
}
