import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { players, characters, games } from "~/campaign/moonstone.server";
import type { AugmentedGame, Character, Player } from "~/campaign/moonstone";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import type { RouteMatch } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";
import StatCard from "~/campaign/StatCard";
import { ucFirst } from "~/utils/text";
import GameRow from "~/campaign/GameRow";

type LoaderData = {
  player: Player;
  characters: { [key: string]: Character };
  games: { [key: string]: AugmentedGame[] };
};

export const loader: LoaderFunction = async ({ params }) => {
  const playerSlug = params.playerSlug;
  invariant(playerSlug, "playerSlug not found");

  const player = players[playerSlug];
  if (!player) {
    throw new Response("Player not found", { status: 404 });
  }

  const playerGames = Object.fromEntries(
    Object.entries(games)
      .filter(([, playerGames]) => !!playerGames[playerSlug])
      .map(([month, playerGames]) => {
        const playersGame: AugmentedGame = {
          ...(playerGames[playerSlug] ?? {}),
          playerSlug,
          player,
        };
        const [opponentsSlug, opponentsGameData] = Object.entries(
          playerGames,
        ).find(
          ([slug, { table }]) =>
            table === playersGame.table && slug !== playerSlug,
        )!;

        const opponentsGame: AugmentedGame = {
          ...opponentsGameData,
          playerSlug: opponentsSlug,
          player: players[opponentsSlug],
        };

        return [month, [playersGame, opponentsGame]];
      }),
  );

  return json<LoaderData>({ player, characters, games: playerGames });
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }: RouteMatch) => {
      const { player } = data as LoaderData;
      return player.name;
    },
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export default function PlayerPage() {
  const { player, characters, games } = useLoaderData() as LoaderData;

  return (
    <div
      className="player-page-wrapper"
      style={{
        backgroundImage: `url("/_static/images/${player.faction}.png")`,
      }}
    >
      <h2>
        {player.name} <small>{player.faction}</small>
      </h2>
      <h3>Games</h3>
      <div className="game-list">
        {Object.entries(games).map(([month, row]) => (
          <GameRow
            key={month}
            label={<Link to={`../../games/${month}`}>{ucFirst(month)}</Link>}
            row={row}
          />
        ))}
      </div>
      <h3>Roster</h3>
      <div className="card-grid">
        {player.characters.map(({ cardId }) => {
          const character = characters[cardId];

          return (
            <StatCard
              key={cardId}
              cardId={character?.cardId}
              moveId={character?.moveId}
              name={character?.name}
            />
          );
        })}
      </div>
    </div>
  );
}
