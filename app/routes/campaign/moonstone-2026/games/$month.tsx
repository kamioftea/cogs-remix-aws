import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { AugmentedGameV2, PlayerV2, PlayerGame } from "~/campaign/moonstone";
import { moonstone2026 } from "~/campaign/moonstone.server";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import type { RouteMatch } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { ucFirst } from "~/utils/text";
import { useMemo } from "react";
import GameRow from "~/campaign/GameRow";
import invariant from "tiny-invariant";

type LoaderData = {
  month: string;
  games: { [key: string]: PlayerGame };
  players: { [key: string]: PlayerV2 };
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.month, "month not found");
  const { games, players } = moonstone2026;

  const playerGames = games[params.month];
  if (!playerGames) {
    throw new Response("Month not found", { status: 404 });
  }

  return json<LoaderData>({
    month: ucFirst(params.month),
    games: playerGames,
    players,
  });
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }: RouteMatch) => {
      const { month } = data as LoaderData;
      return month;
    },
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export default function PlayerPage() {
  const { month, games, players } = useLoaderData() as LoaderData;

  const rows = useMemo(
    () =>
      Object.entries(games).reduce<{ [key: number]: AugmentedGameV2[] }>(
        (acc, [playerSlug, game]) => ({
          ...acc,
          [game.table]: [
            ...(acc[game.table] || []),
            {
              playerSlug,
              player: players[playerSlug],
              ...game,
            },
          ],
        }),
        {} as { [key: number]: AugmentedGameV2[] },
      ),
    [players, games],
  );

  return (
    <>
      <h2>{month}</h2>
      <div className="game-list">
        {Object.entries(rows).map(([table, row]) => (
          <GameRow key={table} label={`Table ${table}`} row={row} />
        ))}
      </div>
    </>
  );
}
