import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { useCatch, useLoaderData } from "@remix-run/react";
import { listTournamentAttendeesByEventSlug } from "~/tournament/attendee-model.server";
import { fetchMastersPlayerIdLookup } from "~/utils";
import { json } from "@remix-run/router";
import { useEffect, useState } from "react";
import { BlobWriter, HttpReader, ZipWriter } from "@zip.js/zip.js";

interface LoaderData {
  lists: { filename: string, url: string }[];
  zipFilename: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventSlug, "From route");

  const tournament = getTournamentBySlug(params.eventSlug);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  if (!tournament.kowMastersEventId) {
    throw new Response("Event missing masters id", { status: 500 });
  }

  const attendees = await listTournamentAttendeesByEventSlug(params.eventSlug);
  const lookup = await fetchMastersPlayerIdLookup(tournament.kowMastersSeason);

  const lists =
    attendees
      .filter(attendee => !!attendee.additionalFields.army_list)
      .map(attendee => ({
        filename: `${lookup[attendee.name.toLowerCase().trim()] ?? attendee.slug}.pdf`,
        url: `/event/${tournament.slug}/profile/${attendee.slug}/army-list`
      }));

  return json<LoaderData>({
    lists,
    zipFilename: `${tournament.slug}-lists.zip`
  });
};

async function getZipFileBlob(lists: LoaderData["lists"], setCount: (n: number) => void) {
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"), { bufferedWrite: true });
  let count = 0;
  for(let { filename, url } of lists) {
    await zipWriter.add(filename, new HttpReader(url));
    setCount(++count);
  }
  return await zipWriter.close();
}

export default function MastersZipPage() {
  const { lists, zipFilename } = useLoaderData<typeof loader>() as LoaderData;
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [count, setCount] = useState(0)

  useEffect(() => {
    let objectUrl: string | null = null
    getZipFileBlob(lists, setCount)
      .then(blob => {
        objectUrl = URL.createObjectURL(blob);
        setZipUrl(objectUrl)
      });

    return () => {
      if (objectUrl) {
        //URL.revokeObjectURL(objectUrl);
      }
    };
  }, [lists]);

  return <>
    {zipUrl
      ? <a href={zipUrl} download={zipFilename}>Download ZIP</a>
      : <p>Loading {count} of {lists.length}</p>
    }
    <p>
      <a href={"../"}>Back to event admin</a>
    </p>
  </>;
}

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
