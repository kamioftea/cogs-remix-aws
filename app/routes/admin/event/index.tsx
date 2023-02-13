import type { Tournament } from "~/tournament/tournament-model.server";
import { tournaments } from "~/tournament/tournament-model.server";
import type { LoaderFunction } from "@remix-run/router";
import { json } from "@remix-run/router";
import { Link, useLoaderData } from "@remix-run/react";

interface LoaderData {
  tournaments: Tournament[];
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ tournaments });
};

export default function EventsIndexPage() {
  const { tournaments } = useLoaderData<LoaderData>();

  return (
    <>
      {tournaments.map((tournament) => (
        <div key={tournament.slug}>
          <Link to={`./${tournament.slug}`}>{tournament.title}</Link>
        </div>
      ))}
    </>
  );
}
