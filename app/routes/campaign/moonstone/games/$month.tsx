import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { AugmentedGame, Player, PlayerGame } from "~/campaign/moonstone";
import { games, players } from "~/campaign/moonstone.server";
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
  players: { [key: string]: Player };
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.month, "month not found");

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
      Object.entries(games).reduce<{ [key: number]: AugmentedGame[] }>(
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
        {} as { [key: number]: AugmentedGame[] },
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
