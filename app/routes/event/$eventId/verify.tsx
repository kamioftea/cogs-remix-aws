import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import * as React from "react";
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import { validateAttendeeKey } from "~/account/auth.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import invariant from "tiny-invariant";
import type { Attendee } from "~/tournament/attendee-model.server";
import { putAttendee } from "~/tournament/attendee-model.server";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import { createUserSession } from "~/account/session.server";

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

  return createUserSession({
    request,
    email: attendee.email,
    redirectTo: `/event/${params.eventId}/edit-details`,
  });
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
          attending {tournament.title}
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
