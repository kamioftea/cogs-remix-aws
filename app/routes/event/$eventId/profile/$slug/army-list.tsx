import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { getTournamentAttendeeBySlug } from "~/tournament/attendee-model.server";

import { getSessionAttendee, getUser } from "~/account/session.server";
import { getUpload } from "~/upload/upload-model.server";
import { getFile } from "~/upload/s3-file-manager.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { useCatch } from "@remix-run/react";
import { Role } from "~/account/user-model";

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

  const user = await getUser(request);
  const sessionAttendee = await getSessionAttendee(request, tournament.slug);

  if (
    !tournament.listsSubmissionClosed &&
    sessionAttendee?.email !== attendee.email &&
    !user?.roles?.includes(Role.Admin)
  ) {
    throw new Response("You do not have access to this army list", {
      status: 403,
    });
  }

  if (!attendee.additionalFields.army_list) {
    throw new Response("No army list has been submitted", { status: 404 });
  }

  const upload = await getUpload(attendee.additionalFields.army_list);
  if (!upload) {
    throw new Response("No army list has been submitted", { status: 404 });
  }

  const contents = await getFile(upload.key);
  if (!contents) {
    throw new Response("Uploaded file has been removed", { status: 404 });
  }

  return new Response(contents?.transformToWebStream(), {
    status: 200,
    headers: {
      "Content-Type": upload.contentType,
      "Content-Disposition": `attachment; filename="${upload.filename}"`,
    },
  });
};

export function ErrorBoundary() {
  return <GenericErrorPage />;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <ErrorPage heading="Event not found">
        <p>Sorry, there is no active event matching the requested URL.</p>
      </ErrorPage>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
