import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { Tournament } from "~/tournament/tournament-model.server";
import {
  getTournamentBySlug,
  upsertTournamentOverride,
} from "~/tournament/tournament-model.server";
import type { Scenario } from "~/tournament/scenario/scenario";
import type { PlayerGame } from "~/tournament/player-game-model.server";
import {
  deletePlayerGame,
  getGamesForRound,
  lockRound,
  populateRound,
  publishRound,
  putPlayerGame,
  updateScoresForTable,
} from "~/tournament/player-game-model.server";
import type { ActionFunction } from "@remix-run/router";
import { redirect } from "@remix-run/router";
import type { Attendee } from "~/tournament/attendee-model.server";
import { listTournamentAttendeesByEventSlug } from "~/tournament/attendee-model.server";
import { FiCheck } from "react-icons/fi";
import {
  ScoreInputField,
  ScoreInputValue,
} from "~/tournament/scenario/scenario";
import React, { useEffect, useMemo, useState } from "react";
import FormInput from "~/form/input";
import dayjs from "dayjs";

interface LoaderData {
  roundIndex: number;
  scenario: Scenario;
  mapUrl: string;
  roundEnd: string | undefined;
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

  const { scenario, mapUrl, roundEnd } = tournament.scenarios[roundIndex - 1];

  const playerGames = await getGamesForRound(tournament.slug, roundIndex - 1);
  const attendees = await listTournamentAttendeesByEventSlug(tournament.slug);
  const attendeesBySlug = Object.fromEntries(attendees.map((a) => [a.slug, a]));

  return json<LoaderData>({
    roundIndex,
    scenario,
    mapUrl,
    roundEnd,
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
    case "lock": {
      await lockRound(tournament.slug, roundIndex - 1);
      break;
    }
    case "update": {
      await Promise.all(
        (await getGamesForRound(tournament.slug, roundIndex - 1)).map(
          async (game) => {
            let updated = false;
            let scores = false;
            let tableNumber = parseInt(
              formData[`tableNumber[${game.attendeeSlug}]`].toString(),
            );
            if (tableNumber && tableNumber !== game.tableNumber) {
              game.tableNumber = tableNumber;
              updated = true;
            }

            if (
              formData["attendee_slug"] &&
              game.attendeeSlug === formData["attendee_slug"]
            ) {
              const { scenario } = tournament.scenarios[roundIndex - 1];
              game.scoreBreakdown = Object.fromEntries(
                scenario.scoreInputs
                  .map((input) => {
                    return [
                      input.name,
                      (formData[input.name]?.toString() ?? "").match(/^\d+$/)
                        ? parseInt(formData[input.name].toString())
                        : undefined,
                    ];
                  })
                  .filter(([, v]) => v != undefined),
              );

              game.routedPoints = (
                formData["routed_points"]?.toString() ?? ""
              ).match(/^\d+$/)
                ? parseInt(formData["routed_points"].toString())
                : undefined;

              game.locked = true;
              scores = true;
            }

            if (updated || scores) {
              await putPlayerGame(game);
            }

            if (scores) {
              await updateScoresForTable(
                game.eventSlug,
                game.roundIndex,
                game.tableNumber,
              );
            }
          },
        ),
      );

      const roundEndRaw = formData["roundEnd"].toString() ?? undefined;
      let roundEnd: string | undefined = undefined;
      if (roundEndRaw) {
        const roundEndDate = dayjs(roundEndRaw);
        roundEnd = roundEndDate.isValid()
          ? roundEndDate.format("YYYY-MM-DD HH:mm:ss")
          : undefined;
      }

      const scenarios: Partial<Tournament["scenarios"][number]>[] = Array(
        tournament.scenarios.length,
      ).fill({});
      scenarios[roundIndex - 1] = roundEnd ? { roundEnd } : {};

      await upsertTournamentOverride(tournament.slug, { scenarios }, [
        `scenarios.${roundIndex - 1}.roundEnd`,
      ]);

      break;
    }
    case "delete": {
      await deletePlayerGame(
        tournament.slug,
        roundIndex - 1,
        formData["attendee_slug"].toString(),
      );
    }
  }

  return redirect(`/admin/event/${tournament.slug}/round/${roundIndex}`);
};

export default function RoundPage() {
  const { playerGames, attendeesBySlug, scenario, roundEnd }: LoaderData =
    useLoaderData<typeof loader>() satisfies LoaderData;

  const [currentAttendee, setCurrentAttendee] = useState<string | null>(null);

  const [roundEndValue, setRoundEndValue] = useState<string | undefined>(
    roundEnd,
  );

  useEffect(() => {
    setCurrentAttendee(null);
  }, [playerGames]);

  useEffect(() => {
    setRoundEndValue(roundEnd);
  }, [roundEnd]);

  const [formActions, presentAttendeeCount] = useMemo(() => {
    const formActions = [];

    const presentAttendees = [...Object.values(attendeesBySlug)].filter(
      (a) => a.present,
    ).length;

    if ((playerGames || []).length < presentAttendees) {
      formActions.push({ value: "populate", label: "Populate round" });
    }

    if (playerGames && playerGames.length > 0) {
      formActions.push({ value: "update", label: "Update" });
      if (playerGames.some((pg) => !pg.locked)) {
        formActions.push({ value: "lock", label: "Lock" });
      }
    }

    if ((playerGames || []).some((pg) => !pg.published)) {
      formActions.push({ value: "publish", label: "Publish games" });
    }

    return [formActions, presentAttendees];
  }, [playerGames, attendeesBySlug]);

  return (
    <>
      <Form method="POST">
        {playerGames.length > 0 ? (
          <>
            <FormInput
              label="Round end"
              type="text"
              name="roundEnd"
              value={roundEndValue}
              onChange={(e) => setRoundEndValue(e.target.value)}
            />
            <button
              type="button"
              className="button small primary"
              onClick={(e) => {
                e.preventDefault();
                setRoundEndValue(dayjs().format("YYYY-MM-DD HH:mm:ss"));
              }}
            >
              Set Now
            </button>
          </>
        ) : null}
        {formActions.map(({ value, label }) => (
          <button
            name="action"
            value={value}
            key={value}
            className="button small primary"
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
              <th>Locked</th>
              {scenario.scoreInputs.map((input) => (
                <th key={input.name}>{input.label}</th>
              ))}
              <th>Routed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {playerGames.map((game) => (
              <tr key={game.attendeeSlug}>
                <td>
                  <input
                    type="number"
                    max={Math.ceil(presentAttendeeCount / 2)}
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
                <td>{game.locked ? <FiCheck /> : <>&times;</>}</td>
                {scenario.scoreInputs.map((input) => {
                  const Element =
                    currentAttendee === game.attendeeSlug
                      ? ScoreInputField
                      : ScoreInputValue;
                  return (
                    <td key={input.name}>
                      <Element
                        scoreInput={input}
                        value={game.scoreBreakdown?.[input.name]}
                      />
                    </td>
                  );
                })}
                <td>
                  {currentAttendee === game.attendeeSlug ? (
                    <FormInput
                      label=""
                      type="number"
                      name="routed_points"
                      defaultValue={game.routedPoints?.toString()}
                    />
                  ) : (
                    game.routedPoints ?? "-"
                  )}
                </td>
                <td>
                  {currentAttendee === game.attendeeSlug ? (
                    <>
                      <input
                        type="hidden"
                        name="attendee_slug"
                        value={game.attendeeSlug}
                      />
                      <button
                        type="submit"
                        name="action"
                        value="update"
                        className="button primary tiny"
                      >
                        Update
                      </button>
                      <button
                        type="submit"
                        name="action"
                        value="delete"
                        className="button alert tiny"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentAttendee(null);
                        }}
                        className="button secondary tiny"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentAttendee(game.attendeeSlug);
                      }}
                      className="button primary small"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Form>
    </>
  );
}
