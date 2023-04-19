import { useLoaderData, Form } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import type { Scenario } from "~/tournament/scenario/scenario";
import type {
  PlayerGame} from "~/tournament/player-game-model.server";
import {
  getGamesForRound,
  populateRound,
  publishRound,
  savePlayerGame,
} from "~/tournament/player-game-model.server";
import type { ActionFunction} from "@remix-run/router";
import { redirect } from "@remix-run/router";
import type {
  Attendee} from "~/tournament/attendee-model.server";
import {
  listTournamentAttendeesByEventSlug,
} from "~/tournament/attendee-model.server";
import { FiCheck } from "react-icons/fi";

interface LoaderData {
  roundIndex: number;
  scenario: Scenario;
  mapUrl: string;
  playerGames: PlayerGame[];
  attendeesBySlug: Record<string, Attendee>;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventSlug, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");

  const tournament = await getTournamentBySlug(params.eventSlug);
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

  const playerGames = await getGamesForRound(tournament.slug, roundIndex - 1);
  const attendeesBySlug = Object.fromEntries(
    (await listTournamentAttendeesByEventSlug(tournament.slug)).map((a) => [
      a.slug,
      a,
    ])
  );

  return json<LoaderData>({
    roundIndex,
    scenario,
    mapUrl,
    playerGames,
    attendeesBySlug,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventSlug, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");

  const tournament = await getTournamentBySlug(params.eventSlug);
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

  const formData = Object.fromEntries(await request.formData());
  invariant(typeof formData.action === "string", "roundIndex not found");
  switch (formData.action) {
    case "populate": {
      await populateRound(tournament.slug, roundIndex - 1);
      break;
    }
    case "publish": {
      await publishRound(tournament.slug, roundIndex - 1);
      break;
    }
    case "update": {
      await Promise.all(
        (
          await getGamesForRound(tournament.slug, roundIndex - 1)
        ).map(async (game) => {
          let updated = false;
          let tableNumber = parseInt(
            formData[`tableNumber[${game.attendeeSlug}]`].toString()
          );
          if (tableNumber && tableNumber !== game.tableNumber) {
            game.tableNumber = tableNumber;
            updated = true;
          }

          if (updated) {
            await savePlayerGame(game);
          }
        })
      );
      break;
    }
  }

  return redirect(`/admin/event/${tournament.slug}/round/${roundIndex}`);
};

export default function RoundPage() {
  const { playerGames, attendeesBySlug } = useLoaderData<
    typeof loader
  >() as LoaderData;

  const formActions = [];

  if ((playerGames || []).length < Object.keys(attendeesBySlug).length) {
    formActions.push({ value: "populate", label: "Populate round" });
  }

  if (playerGames && playerGames.length > 0) {
    formActions.push({ value: "update", label: "Update" });
  }

  if ((playerGames || []).some((pg) => !pg.published)) {
    formActions.push({ value: "publish", label: "Publish games" });
  }

  return (
    <>
      <Form method="POST">
        {formActions.map(({ value, label }) => (
          <button
            name="action"
            value={value}
            key={value}
            className="button primary"
          >
            {label}
          </button>
        ))}
        <table>
          <thead>
            <tr>
              <th>Table</th>
              <th>Player</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {playerGames.map((game) => (
              <tr key={game.attendeeSlug}>
                <td>
                  <input
                    type="number"
                    max={Math.ceil(playerGames.length / 2)}
                    name={`tableNumber[${game.attendeeSlug}]`}
                    defaultValue={game.tableNumber}
                    style={{ width: "5rem" }}
                  />
                </td>
                <td>
                  {attendeesBySlug[game.attendeeSlug]?.name ??
                    "Unknown attendee"}
                </td>
                <td>{game.published ? <FiCheck /> : <>&times;</>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Form>
    </>
  );
}
