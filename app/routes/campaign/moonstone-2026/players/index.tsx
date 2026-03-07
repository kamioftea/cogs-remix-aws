import { Link, useLoaderData } from "@remix-run/react";
import { sortBy } from "~/utils";
import type { PlayerV2 } from "~/campaign/moonstone";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { moonstone2026 } from "~/campaign/moonstone.server";

type LoaderData = {
  players: Record<string, PlayerV2>;
};

export const loader: LoaderFunction = async () => {
  const { players, games } = moonstone2026;

  const scoresByPlayer = Object.values(games)
    .flatMap((gamesForMonth) => Object.entries(gamesForMonth))
    .reduce<Record<string, { vps: number; mps: number }>>(
      (acc, [slug, { moonstones, extraVictoryPoints, machinationPoints }]) => {
        const player = acc[slug] ?? { mps: 0, vps: 0 };
        return {
          ...acc,
          [slug]: {
            mps: player.mps + (machinationPoints ?? 0),
            vps: player.vps + moonstones + (extraVictoryPoints ?? 0),
          },
        };
      },
      {},
    );

  const playersWithCounts = Object.fromEntries(
    Object.entries(players).map(([name, data]) => [
      name,
      {
        ...data,
        vps: scoresByPlayer[name]?.vps ?? 0,
        mps: scoresByPlayer[name]?.mps ?? 0,
      },
    ]),
  );

  return json<LoaderData>({players: playersWithCounts});
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
            <th>VPs</th>
            <th>MPs</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(players)
            .sort(
              sortBy(
                ([, p]) => -(p.vps ?? 0) - (p.mps ?? 0),
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
                <td>{player.vps ?? 0}</td>
                <td>{player.mps ?? 0}</td>
                <td>{(player.vps ?? 0) + (player.mps ?? 0)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
