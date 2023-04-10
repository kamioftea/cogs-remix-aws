import { json, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import {
  Attendee,
  getTournamentAttendeeBySlug,
} from "~/tournament/attendee-model.server";

import { getSessionAttendee } from "~/account/session.server";
import { useCatch, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { TournamentLoaderData } from "~/routes/event/$eventId";
import { Breadcrumb, CURRENT } from "~/utils/breadcrumbs";
import { additionalFieldTypes } from "~/tournament/additional-fields";
import * as React from "react";
import { Fragment } from "react";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";

interface LoaderData {
  attendee: Attendee;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  invariant(params.slug, "From route");

  const tournament = getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const attendee = await getTournamentAttendeeBySlug(
    tournament.slug,
    params.slug
  );
  if (!attendee) {
    throw new Response("Attendee not found", { status: 404 });
  }

  const sessionAttendee = await getSessionAttendee(request, tournament.slug);

  const additionalFieldsPublic =
    tournament.listsSubmissionClosed ||
    sessionAttendee?.email === attendee.email;

  return json<LoaderData>({
    attendee: {
      ...attendee,
      email: "",
      ...(additionalFieldsPublic ? {} : { additionalFields: {} }),
    },
  });
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }) => {
      const { attendee } = data as LoaderData;
      return attendee.name;
    },
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export default function LoginAsAttendeePage() {
  const { attendee } = useLoaderData<typeof loader>();

  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  return (
    <>
      <h2>{attendee.name}</h2>
      <dl>
        {tournament.additionalFields?.map((spec) => {
          return attendee.additionalFields[spec.name] ? (
            <Fragment key={spec.name}>
              <dt>{spec.label}</dt>
              <dd>
                {additionalFieldTypes[spec.type].profile(
                  attendee.additionalFields[spec.name],
                  attendee
                )}
              </dd>
            </Fragment>
          ) : null;
        })}
      </dl>
    </>
  );
}

export function ErrorBoundary() {
  return <GenericErrorPage />;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <ErrorPage heading="Event not found">
        <p>Sorry, there is no attendee matching the requested URL.</p>
      </ErrorPage>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
