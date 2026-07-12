import type {LoaderFunction} from "@remix-run/node";
import { redirect,json} from "@remix-run/node";
import invariant from "tiny-invariant";
import type {PlayerGame} from "~/tournament/player-game-model.server";
import {getPlayersByTable, putPlayerGame, updateScoresForTable,} from "~/tournament/player-game-model.server";
import {getOutcomeBonus, getRoutedBonus,} from "~/tournament/player-game-model";
import type {AttendeeDisplayData} from "~/tournament/attendee-model.server";
import {attendeeDisplayDataBySlug} from "~/tournament/attendee-model.server";
import {Form, Link, useActionData, useCatch, useLoaderData, useRouteLoaderData,} from "@remix-run/react";
import type {TournamentLoaderData} from "~/routes/event/$eventId";
import type {Breadcrumb} from "~/utils/breadcrumbs";
import {CURRENT} from "~/utils/breadcrumbs";
import type {ReactNode} from "react";
import React, {Fragment, useMemo} from "react";
import {ArmyList} from "~/tournament/army-list-field";
import type {RoundLoaderData} from "~/routes/event/$eventId/round/$roundIndex";
import {ScoreInputField, ScoreInputValue,} from "~/tournament/scenario/scenario";
import FormInput from "~/form/input";
import type {ActionFunction} from "@remix-run/router";
import {getSessionAttendee, getUser} from "~/account/session.server";
import ErrorPage, {GenericErrorPage} from "~/error-handling/error-page";
import {getTournamentBySlug} from "~/tournament/tournament-model.server";
import {sortBy, useOptionalUser} from "~/utils";
import {Role} from "~/account/user-model";

interface LoaderData {
  playerGames: PlayerGame[];
  attendeesBySlug: Record<string, AttendeeDisplayData>;
  tableNumber: number;
}

export const loader: LoaderFunction = async ({params}) => {
  invariant(params.eventId, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");
  invariant(params.tableNumber, "tableNumber not found");
  
  if (!params.tableNumber.match(/^\d+$/)) {
    throw new Response("roundIndex must be an integer", {status: 400});
  }
  
  const roundIndex = parseInt(params.roundIndex);
  const tableNumber = parseInt(params.tableNumber);
  
  const playerGames = (
    await getPlayersByTable(params.eventId, roundIndex - 1, tableNumber)
  )
    .filter((pg) => pg.published)
    .sort(sortBy((pg) => pg.attendeeSlug));
  
  const attendeesBySlug = await attendeeDisplayDataBySlug(params.eventId);
  
  return json<LoaderData>(
    {
      playerGames: playerGames,
      attendeesBySlug,
      tableNumber,
    }
  );
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({data}) => {
      const {tableNumber} = data as LoaderData || {};
      return `Table ${tableNumber}`;
    },
    url: CURRENT,
  },
];

export const handle = {breadcrumbs};

export const action: ActionFunction = async ({request, params}) => {
  invariant(params.eventId, "eventId not found");
  invariant(params.roundIndex, "roundIndex not found");
  invariant(params.tableNumber, "tableNumber not found");
  const formData = Object.fromEntries(await request.formData());
  
  const roundIndex = parseInt(params.roundIndex) - 1;
  const tableNumber = parseInt(params.tableNumber);
  
  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", {status: 404});
  }
  
  const user = await getUser(request);
  const attendee = await getSessionAttendee(request, tournament.slug);
  
  const playerGames =
    await getPlayersByTable(params.eventId, roundIndex, tableNumber);
  
  const canSubmitScores =
    user?.roles?.includes(Role.Admin)
    || !!playerGames.find((pg) => pg.attendeeSlug === attendee?.slug);
  
  if (!canSubmitScores) {
    return json({msg: 'You can\'t submit scores for this game', className: 'alert'})
  }
  
  const {scenario} = tournament.scenarios[roundIndex];
  
  await Promise.all(
    playerGames.map(async (game) => {
      game.scoreBreakdown = Object.fromEntries(
        scenario.scoreInputs
                .map((input) => {
                  return [
                    input.name,
                    (formData[`${game.attendeeSlug}[${input.name}]`]?.toString() ?? "").match(/^\d+$/)
                    ? parseInt(formData[`${game.attendeeSlug}[${input.name}]`].toString())
                    : undefined,
                  ];
                })
                .filter(([, v]) => v != undefined),
      );
      
      game.routedPoints =
        (formData[`${game.attendeeSlug}[routed_points]`]?.toString() ?? "")
          .match(/^\d+$/)
        ? parseInt(formData[`${game.attendeeSlug}[routed_points]`].toString())
        : undefined;
      
      await putPlayerGame(game);
      await updateScoresForTable(game.eventSlug, game.roundIndex, game.tableNumber);
    })
  );
  
  return redirect(`/event/${params.eventId}/round/${params.roundIndex}/table/${params.tableNumber}`);
};

export default function RoundIndexPage() {
  const {playerGames, attendeesBySlug, tableNumber} = useLoaderData<
    typeof loader
  >() as LoaderData;
  
  const {msg, className: msgClass} = useActionData<{msg?: string, className?: string}>() || {msg: null, className: null};
  
  const {tournament, currentAttendee} = useRouteLoaderData(
    "routes/event/$eventId",
  ) as TournamentLoaderData;
  
  const {roundIndex} = useRouteLoaderData(
    "routes/event/$eventId/round/$roundIndex",
  ) as RoundLoaderData;
  
  const user = useOptionalUser();
  
  const scenario = tournament.scenarios[roundIndex - 1].scenario;
  
  const canSubmitScores =
    user?.roles?.includes(Role.Admin)
    || !!playerGames.find((pg) => pg.attendeeSlug === currentAttendee?.slug);
  
  const scoreTableRows: Record<string, (game: PlayerGame) => ReactNode> =
    useMemo(
      () => ({
        ...Object.fromEntries(
          scenario.scoreInputs.map((input) => [
            input.label,
            (game) =>
              !game.locked && canSubmitScores ? (
                <ScoreInputField
                  attendeeSlug={game.attendeeSlug}
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
          !game.locked && canSubmitScores ? (
            <FormInput
              label=""
              type="number"
              name={`${game.attendeeSlug}[routed_points]`}
              max={tournament.pointsLimit}
              defaultValue={game.routedPoints?.toString()}
            />
          ) : (
            game.routedPoints ?? "-"
          ),
        "Bonus for routed units": (game) =>
          game.routedPoints != null
          ? getRoutedBonus(game.routedPoints, tournament.bands)
          : "-",
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
      [currentAttendee?.slug, scenario, tournament, canSubmitScores],
    );
  
  if ((playerGames || []).length === 0) {
    return null;
  }
  
  return (
    <>
      <h3>Table {tableNumber}</h3>
      {msg && msgClass
        ? <div className={`callout ${msgClass}`}>{msg}</div>
        : null
      }
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
                  <br/>
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
        {canSubmitScores
         ? <button type="submit" className="button primary">Submit scores</button>
         : null
        }
      </Form>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  
  if (caught.data.heading && caught.data.message) {
    return (
      <ErrorPage heading={caught.data.heading}>
        <div dangerouslySetInnerHTML={{__html: caught.data.message}}/>
      </ErrorPage>
    );
  }
  
  return <GenericErrorPage/>;
}
