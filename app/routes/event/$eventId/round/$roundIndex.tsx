import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import { Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { Scenario } from "~/tournament/scenario/scenario";

export interface RoundLoaderData {
  roundIndex: number;
  scenario: Scenario;
  mapUrl: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  if (!params.roundIndex.match(/^\d+$/)) {
    throw new Response("roundIndex must be an integer", { status: 400 });
  }

  const roundIndex = parseInt(params.roundIndex);
  if (!tournament.scenarios[roundIndex - 1]) {
    throw new Response("Round not found", { status: 404 });
  }

  const { scenario, mapUrl } = tournament.scenarios[roundIndex - 1];

  return json<RoundLoaderData>({
    roundIndex,
    scenario,
    mapUrl,
  });
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }) => {
      const { roundIndex } = data as RoundLoaderData;
      return `Round ${roundIndex}`;
    },
    url: CURRENT,
  },
];

export const handle = { breadcrumbs };

export default function RoundPage() {
  const { roundIndex, scenario, mapUrl } = useLoaderData<typeof loader>();

  const title = `Round ${roundIndex}: ${scenario.name}`;
  return (
    <div>
      <h2>{title}</h2>
      <Outlet />
      <h3>Setup</h3>
      <img src={mapUrl} className="map" alt={`Scenario map for ${title}`} />
      <div dangerouslySetInnerHTML={{ __html: scenario.setup }} />
      <h3>Scoring</h3>
      <div dangerouslySetInnerHTML={{ __html: scenario.scoring }} />
    </div>
  );
}
