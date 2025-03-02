import { Link, useLoaderData } from "@remix-run/react";
import { sortBy } from "~/utils";
import type { Player, RosterCharacter } from "~/campaign/moonstone";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { players, games } from "~/campaign/moonstone.server";

type LoaderData = {
  players: Record<string, Player>;
};

function sumRoster(
  key: "moonstones" | "kills" | "deaths",
  characters: RosterCharacter[],
): number {
  return characters.reduce((acc, character) => acc + character[key], 0);
}

export const loader: LoaderFunction = async () => {
  const moonstonesByPlayer = Object.values(games)
    .flatMap((gamesForMonth) => Object.entries(gamesForMonth))
    .reduce<Record<string, number>>(
      (acc, [player, { moonstones }]) => ({
        ...acc,
        [player]: (acc[player] ?? 0) + moonstones,
      }),
      {},
    );

  const playersWithCounts = Object.fromEntries(
    Object.entries(players).map(([name, data]) => [
      name,
      {
        ...data,
        moonstones: moonstonesByPlayer[name] ?? 0,
        kills: sumRoster("kills", data.characters),
        deaths: sumRoster("deaths", data.characters),
      },
    ]),
  );

  return json<LoaderData>({ players: playersWithCounts });
};

export default function Index() {
  const { players } = useLoaderData() as LoaderData;

  return (
    <>
      <h2>Players</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Faction</th>
            <th>Moonstones</th>
            <th>Kills</th>
            <th>Deaths</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(players)
            .sort(
              sortBy(
                ([, p]) => -(p.moonstones ?? 0),
                ([, p]) => -(p.kills ?? 0),
                ([, p]) => p.deaths ?? 0,
                ([, p]) => p.name,
              ),
            )
            .map(([slug, player]) => (
              <tr key={slug}>
                <td>
                  <Link to={`./${slug}`}>{player.name}</Link>
                </td>
                <td>
                  {player.faction ? (
                    <img
                      className="faction-image-small"
                      src={`/_static/images/${player.faction}.png`}
                      alt={`${player.faction} logo`}
                    />
                  ) : null}{" "}
                  {player.faction ?? (
                    <i className="text-secondary">No faction</i>
                  )}
                </td>
                <td>{player.moonstones}</td>
                <td>{player.kills}</td>
                <td>{player.deaths}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
