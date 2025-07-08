import { Link, useLoaderData } from "@remix-run/react";
import { sortBy } from "~/utils";
import type { Player, RosterCharacter } from "~/campaign/moonstone";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { players, games, characters } from "~/campaign/moonstone.server";

type CharacterRank = {
  name: string;
  player: string;
  score: number;
};

type LoaderData = {
  players: Record<string, Player>;
  mostKills: CharacterRank[];
  mostMoonstones: CharacterRank[];
  mostDeaths: CharacterRank[];
};

function getCharactersRanked(
  players: Record<string, Player>,
  lens: "moonstones" | "kills" | "deaths",
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

function sumRoster(
  key: "moonstones" | "kills" | "deaths",
  characters: RosterCharacter[],
): number {
  return characters.reduce((acc, character) => acc + character[key], 0);
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
        kills: sumRoster("kills", data.characters),
        deaths: sumRoster("deaths", data.characters),
      },
    ]),
  );

  return json<LoaderData>({
    players: playersWithCounts,
    mostKills: getCharactersRanked(players, "kills"),
    mostDeaths: getCharactersRanked(players, "deaths"),
    mostMoonstones: getCharactersRanked(players, "moonstones"),
  });
};

type CharacterRankTableProps = {
  scores: CharacterRank[];
  scoreLabel: string;
};
const CharacterRankTable = ({
  scores,
  scoreLabel,
}: CharacterRankTableProps) => (
  <table>
    <thead>
      <tr>
        <th style={{ width: "50%" }}>Character</th>
        <th style={{ width: "30%" }}>Player</th>
        <th style={{ width: "20%" }}>{scoreLabel}</th>
      </tr>
    </thead>
    <tbody>
      {(scores ?? []).map((score) => (
        <tr key={`${score.name}-${score.player}`}>
          <td>{score.name}</td>
          <td>{score.player}</td>
          <td>{score.score}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function Index() {
  const { players, mostKills, mostDeaths, mostMoonstones } =
    useLoaderData() as LoaderData;

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
            <th>Kills</th>
            <th>Deaths</th>
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
                <td>{player.kills}</td>
                <td>{player.deaths}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h2>Other stats</h2>

      <h3>Most murderous</h3>
      <CharacterRankTable scores={mostKills} scoreLabel={"Kills"} />

      <h3>Most sacrificial</h3>
      <CharacterRankTable scores={mostDeaths} scoreLabel={"Deaths"} />

      <h3>Most covetous</h3>
      <CharacterRankTable scores={mostMoonstones} scoreLabel={"Moonstones"} />
    </>
  );
}
