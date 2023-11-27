import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import type { Scenario } from "~/tournament/scenario/scenario";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { clearInterval } from "timers";

export interface RoundLoaderData {
  roundIndex: number;
  scenario: Scenario;
  mapUrl: string;
  roundEnd?: string;
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

  const { scenario, mapUrl, roundEnd } = tournament.scenarios[roundIndex - 1];

  return json<RoundLoaderData>({
    roundIndex,
    scenario,
    mapUrl,
    roundEnd,
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
  const { roundIndex, scenario, mapUrl, roundEnd } =
    useLoaderData<typeof loader>();

  const title = `Round ${roundIndex}: ${scenario.name}`;
  return (
    <div className="round-page-wrapper">
      <div className="left">
        <h2>{title}</h2>
        <Outlet />
      </div>
      <div className="right">
        {roundEnd && (
          <>
            <h3>Round Timer</h3>
            <CountdownTimer deadlineStr={roundEnd} />
          </>
        )}

        <h3>Setup</h3>
        <img src={mapUrl} className="map" alt={`Scenario map for ${title}`} />
        <div dangerouslySetInnerHTML={{ __html: scenario.setup }} />
        <h3>Scoring</h3>
        <div dangerouslySetInnerHTML={{ __html: scenario.scoring }} />
      </div>
    </div>
  );
}

interface CountdownTimerProps {
  deadlineStr: string;
}

const leftPad = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
};

const CountdownTimer = ({ deadlineStr }: CountdownTimerProps) => {
  const deadline = useMemo(() => dayjs(deadlineStr), [deadlineStr]);

  const [currentPeriod, setCurrentPeriod] = useState<string>("");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      if (now.isAfter(deadline)) {
        setCurrentPeriod("Round over");
        return;
      }

      const hours = deadline.diff(now, "hours");
      const minutes = deadline.diff(now, "minutes") % 60;
      const seconds = deadline.diff(now, "seconds") % 60;
      setCurrentPeriod(
        `${hours.toString()} : ${leftPad(minutes)} : ${leftPad(seconds)}`
      );
    });

    return () => clearInterval(interval);
  }, [deadline]);

  return <div className="round-timer">{currentPeriod}</div>;
};
