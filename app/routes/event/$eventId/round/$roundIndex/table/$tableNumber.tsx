import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { PlayerGame } from "~/tournament/player-game-model.server";
import {
  getGamesForAttendee,
  getPlayersByTable,
  putPlayerGame,
  updateScoresForTable,
} from "~/tournament/player-game-model.server";
import {
  getOutcomeBonus,
  getRoutedBonus,
} from "~/tournament/player-game-model";
import type { AttendeeDisplayData } from "~/tournament/attendee-model.server";
import { attendeeDisplayDataBySlug } from "~/tournament/attendee-model.server";
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import type { ReactNode } from "react";
import React, { Fragment, useMemo } from "react";
import { ArmyList } from "~/tournament/army-list-field";
import type { RoundLoaderData } from "~/routes/event/$eventId/round/$roundIndex";
import {
  ScoreInputField,
  ScoreInputValue,
} from "~/tournament/scenario/scenario";
import FormInput from "~/form/input";
import type { ActionFunction } from "@remix-run/router";
import { redirect } from "@remix-run/router";
import { getSessionAttendee } from "~/account/session.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { sortBy } from "~/utils";

interface LoaderData {
  playerGames: PlayerGame[];
  attendeesBySlug: Record<string, AttendeeDisplayData>;
  tableNumber: number;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");
  invariant(params.tableNumber, "tableNumber not found");

  if (!params.tableNumber.match(/^\d+$/)) {
    throw new Response("roundIndex must be an integer", { status: 400 });
  }

  const roundIndex = parseInt(params.roundIndex);
  const tableNumber = parseInt(params.tableNumber);

  const playerGames = (
    await getPlayersByTable(params.eventId, roundIndex - 1, tableNumber)
  )
    .filter((pg) => pg.published)
    .sort(sortBy((pg) => pg.attendeeSlug));

  const attendeesBySlug = await attendeeDisplayDataBySlug(params.eventId);

  return json<LoaderData>({
    playerGames: playerGames,
    attendeesBySlug,
    tableNumber,
  });
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }) => {
      const { tableNumber } = data as LoaderData;
      return `Table ${tableNumber}`;
    },
    url: CURRENT,
  },
];

export const handle = { breadcrumbs };

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");
  invariant(params.tableNumber, "tableNumber not found");

  const formData = Object.fromEntries(await request.formData());

  const roundIndex = parseInt(params.roundIndex) - 1;
  const tableNumber = parseInt(params.tableNumber);

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const attendee = await getSessionAttendee(request, tournament.slug);
  if (attendee === null) {
    return redirect(`/event/${params.eventId}/send-edit-link`);
  }

  const playerGames = await getGamesForAttendee(tournament.slug, attendee.slug);
  const game = playerGames.find(
    (pg) => pg.roundIndex === roundIndex && pg.tableNumber === tableNumber,
  );
  if (!game) {
    return redirect(`/event/${params.eventId}/round/${roundIndex + 1}`);
  }
  if (game.locked) {
    return redirect(
      `/event/${params.eventId}/round/${roundIndex + 1}/table/${tableNumber}`,
    );
  }

  const { scenario } = tournament.scenarios[roundIndex];
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

  game.routedPoints = (formData["routed_points"]?.toString() ?? "").match(
    /^\d+$/,
  )
    ? parseInt(formData["routed_points"].toString())
    : undefined;
  await putPlayerGame(game);

  await updateScoresForTable(game.eventSlug, game.roundIndex, game.tableNumber);

  return null;
};

export default function RoundIndexPage() {
  const { playerGames, attendeesBySlug, tableNumber } = useLoaderData<
    typeof loader
  >() as LoaderData;

  const { tournament, currentAttendee } = useRouteLoaderData(
    "routes/event/$eventId",
  ) as TournamentLoaderData;

  const { roundIndex } = useRouteLoaderData(
    "routes/event/$eventId/round/$roundIndex",
  ) as RoundLoaderData;

  const scenario = tournament.scenarios[roundIndex - 1].scenario;

  const scoreTableRows: Record<string, (game: PlayerGame) => ReactNode> =
    useMemo(
      () => ({
        ...Object.fromEntries(
          scenario.scoreInputs.map((input) => [
            input.label,
            (game) =>
              !game.locked && game.attendeeSlug === currentAttendee?.slug ? (
                <ScoreInputField
                  scoreInput={input}
                  value={game.scoreBreakdown?.[input.name]}
                />
              ) : (
                <ScoreInputValue
                  scoreInput={input}
                  value={game.scoreBreakdown?.[input.name]}
                />
              ),
          ]),
        ),
        "Scenario points": (game) => game.scenarioScore ?? "-",
        Outcome: (game) => game.outcome ?? "-",
        "Bonus for outcome": (game) =>
          game.outcome != null
            ? getOutcomeBonus(game.outcome, tournament)
            : "-",
        "Total points routed": (game) =>
          !game.locked && game.attendeeSlug === currentAttendee?.slug ? (
            <FormInput
              label=""
              type="number"
              name="routed_points"
              max={tournament.pointsLimit}
              defaultValue={game.routedPoints?.toString()}
            />
          ) : (
            game.routedPoints ?? "-"
          ),
        "Bonus for routed units": (game) =>
          game.routedPoints != null ? getRoutedBonus(game.routedPoints) : "-",
        "Total score": (game) => game.totalScore ?? "-",
        "": (game) =>
          !game.locked && game.attendeeSlug === currentAttendee?.slug ? (
            <button type="submit" className="button primary">
              Submit
            </button>
          ) : (
            ""
          ),
      }),
      [currentAttendee?.slug, scenario, tournament],
    );

  if ((playerGames || []).length === 0) {
    return null;
  }

  return (
    <>
      <h3>Table {tableNumber}</h3>
      <div className="matchup-container">
        {playerGames.map((game, index) => {
          const attendee = attendeesBySlug[game.attendeeSlug];
          return (
            <Fragment key={game.attendeeSlug}>
              <div className="player-card">
                <h3>
                  <Link
                    to={`/event/${tournament.slug}/profile/${game.attendeeSlug}`}
                  >
                    {attendee.name}
                  </Link>
                  <br />
                  <small>{attendee.faction}</small>
                </h3>
                {attendee.army_list && (
                  <ArmyList
                    uploadId={attendee.army_list}
                    eventSlug={tournament.slug}
                    attendeeSlug={game.attendeeSlug}
                  />
                )}
              </div>
              {index === 0 && <div className="vs">vs</div>}
            </Fragment>
          );
        })}
      </div>
      <h3>Scores</h3>
      <Form method="POST">
        <table>
          <thead>
            <tr>
              <th></th>
              {playerGames.map((game) => (
                <th key={game.attendeeSlug}>
                  {attendeesBySlug[game.attendeeSlug].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(scoreTableRows).map(([label, cellBuilder]) => (
              <tr key={label}>
                <td>{label}</td>
                {playerGames.map((game) => (
                  <td key={game.attendeeSlug}>{cellBuilder(game)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Form>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.data.heading && caught.data.message) {
    return (
      <ErrorPage heading={caught.data.heading}>
        <div dangerouslySetInnerHTML={{ __html: caught.data.message }} />
      </ErrorPage>
    );
  }

  return <GenericErrorPage />;
}
