import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { useCatch } from "@remix-run/react";
import { listTournamentAttendeesByEventSlug } from "~/tournament/attendee-model.server";
import { fetchMastersPlayerIdLookup } from "~/utils";
import AdmZip from "adm-zip";
import { getUpload } from "~/upload/upload-model.server";
import { getFile } from "~/upload/s3-file-manager.server";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventSlug, "From route");

  const tournament = await getTournamentBySlug(params.eventSlug);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  if (!tournament.kowMastersEventId) {
    throw new Response("Event missing masters id", { status: 500 });
  }

  const attendees = await listTournamentAttendeesByEventSlug(params.eventSlug);
  const lookup = await fetchMastersPlayerIdLookup(tournament.kowMastersSeason);

  const lists = attendees
    .filter((attendee) => !!attendee.additionalFields.army_list)
    .map((attendee) => ({
      filename: `${
        lookup[attendee.name.toLowerCase().trim()] ?? attendee.slug
      }.pdf`,
      list: attendee.additionalFields.army_list!,
    }));

  const zip = new AdmZip();

  for (let { filename, list } of lists) {
    const upload = await getUpload(list);
    if (!upload) continue;

    const file = await getFile(upload.key);
    if (!file) continue;

    zip.addFile(filename, Buffer.from(await file.transformToByteArray()));
  }

  return new Response(zip.toBuffer(), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${tournament.slug}-lists.zip"`,
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
