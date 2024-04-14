import type { LoaderFunction } from "@remix-run/router";
import { json } from "@remix-run/router";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { Attendee } from "~/tournament/attendee-model.server";
import { listTournamentAttendeesByEventSlug } from "~/tournament/attendee-model.server";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle, FiPlus,
  FiTrash
} from "react-icons/fi";
import type { ReactNode } from "react";
import type { Tournament } from "~/tournament/tournament-model.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";

interface LoaderData {
  attendees: Attendee[];
  tournament: Tournament;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(
    params.eventSlug,
    `eventSlug not found in ${JSON.stringify(Object.keys(params))}`
  );

  const attendees = await listTournamentAttendeesByEventSlug(params.eventSlug);
  const tournament = getTournamentBySlug(params.eventSlug);
  invariant(tournament, "by route")

  return json<LoaderData>({ attendees, tournament });
};

function getStatusTag(attendee: Attendee): ReactNode {
  switch (false) {
    case attendee.approved:
      return (
        <span className="label alert hollow">
          <FiAlertTriangle /> Unapproved
        </span>
      );
    case attendee.verified:
      return (
        <span className="label alert hollow">
          <FiAlertTriangle /> Unverified
        </span>
      );
    case attendee.paid:
      return (
        <span className="label warning hollow">
          <FiAlertCircle /> Unpaid
        </span>
      );
    default:
      return (
        <>
          {attendee.additionalFields.army_list ? (
            <span className="label success hollow">
              <FiCheckCircle /> List
            </span>
          ) : null}
          <span className="label success hollow">
            <FiCheckCircle /> {attendee.present ? 'Present' : 'Paid'}
          </span>
        </>
      );
  }
}

function getApprovalLink(attendee: Attendee): ReactNode {
  if (attendee.approved && attendee.verified) return null;

  return (
    <form
      action={`/admin/event/${attendee.eventSlug}/attendees/${attendee.email}/approve`}
      method="post"
    >
      <button type="submit" className="button clear link display-inline">
        {attendee.approved ? "Resend Verify Email" : "Approve"}
      </button>
    </form>
  );
}

function getPresentLink(attendee: Attendee): ReactNode {
  if (!(attendee.approved && attendee.verified)) return null;
  if (attendee.present) return null;

  return (
    <form
      action={`/admin/event/${attendee.eventSlug}/attendees/${attendee.email}/present`}
      method="post"
    >
      <button type="submit" className="button clear link display-inline">
        Present
      </button>
    </form>
  );
}

function getDeleteLink(attendee: Attendee): ReactNode {
  return (
    <form
      action={`/admin/event/${attendee.eventSlug}/attendees/${attendee.email}/delete`}
      method="post"
      className="display-inline"
    >
      <button
        type="submit"
        className="button clear link display-inline text-alert"
      >
        <FiTrash /> Delete
      </button>
    </form>
  );
}

function getActions(attendee: Attendee): ReactNode {
  return (
    <>
      {getApprovalLink(attendee)}
      {getPresentLink(attendee)}
      {getDeleteLink(attendee)}
    </>
  );
}

export default function EventIndexPage() {
  const { attendees, tournament } = useLoaderData<typeof loader>() as LoaderData;

  return (
    <>
      {tournament.sparePlayer && !attendees.find(a => a.email === tournament.sparePlayer?.email) &&
        <form
          action={`/admin/event/${tournament.slug}/attendees/add-spare-player`}
          method="post"
          className="display-inline"
        >
          <button
            type="submit"
            className="button primary"
          >
            <FiPlus /> Add spare player
          </button>
        </form>
      }
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Slug</th>
          <th>Status</th>
          <th>Army</th>
          <th>Sports</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {attendees.map((attendee: Attendee) => (
          <tr key={attendee.email}>
              <td>
                <Link
                  to={`/admin/event/${attendee.eventSlug}/attendees/${attendee.email}`}
                >
                  {attendee.name}
                </Link>
              </td>
              <td>{attendee.email}</td>
              <td>
                <code>{attendee.slug}</code>
              </td>
              <td>{getStatusTag(attendee)}</td>
              <td>{Object.values(attendee.paintBallot ?? {}).reduce((acc, score) => acc + score, 0)}</td>
              <td>{Object.values(attendee.sportsBallot ?? {}).reduce((acc, score) => acc + score, 0)}</td>
              <td>{getActions(attendee)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
