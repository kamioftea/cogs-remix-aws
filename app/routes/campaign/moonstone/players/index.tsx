import { Link, useLoaderData } from "@remix-run/react";
import { sortBy } from "~/utils";
import type { Player } from "~/campaign/moonstone";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { players } from "~/campaign/moonstone.server";

type LoaderData = {
  players: Record<string, Player>;
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ players });
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
          </tr>
        </thead>
        <tbody>
          {Object.entries(players)
            .sort(
              sortBy(
                ([, p]) => -p.moonstones,
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
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
