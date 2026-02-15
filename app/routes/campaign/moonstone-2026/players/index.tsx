import { Link, useLoaderData } from "@remix-run/react";
import { sortBy } from "~/utils";
import type { PlayerV2 } from "~/campaign/moonstone";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { moonstone2026, characters } from "~/campaign/moonstone.server";

const { players, games } = moonstone2026;

type CharacterRank = {
  name: string;
  player: string;
  score: number;
};

type LoaderData = {
  players: Record<string, PlayerV2>;
  mostMoonstones: CharacterRank[];
};

function getCharactersRanked(
  players: Record<string, PlayerV2>,
  lens: "moonstones",
): CharacterRank[] {
  return Object.values(players)
    .flatMap((player) =>
      player.characters.map((character) => ({
        name: characters[character.cardId]?.name,
        player: player.name,
        score: character[lens],
      })),
    )
    .sort(sortBy((score) => -score.score))
    .reduce((acc: CharacterRank[], score: CharacterRank) => {
      if (acc.length < 5) {
        return [...acc, score];
      }

      // Top five - extended to include further ties
      const last = acc.slice(-1)[0];
      if (last?.score === score.score) {
        return [...acc, score];
      }

      return acc;
    }, []);
}

export const loader: LoaderFunction = async () => {
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

  return json<LoaderData>({
    players: playersWithCounts,
    mostMoonstones: getCharactersRanked(players, "moonstones"),
  });
};

// type CharacterRankTableProps = {
//   scores: CharacterRank[];
//   scoreLabel: string;
// };
// const CharacterRankTable = ({
//   scores,
//   scoreLabel,
// }: CharacterRankTableProps) => (
//   <table>
//     <thead>
//       <tr>
//         <th style={{ width: "50%" }}>Character</th>
//         <th style={{ width: "30%" }}>Player</th>
//         <th style={{ width: "20%" }}>{scoreLabel}</th>
//       </tr>
//     </thead>
//     <tbody>
//       {(scores ?? []).map((score) => (
//         <tr key={`${score.name}-${score.player}`}>
//           <td>{score.name}</td>
//           <td>{score.player}</td>
//           <td>{score.score}</td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );

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

      {/*<h2>Most covetous</h2>*/}
      {/*<CharacterRankTable scores={mostMoonstones} scoreLabel={"Moonstones"} />*/}
    </>
  );
}
