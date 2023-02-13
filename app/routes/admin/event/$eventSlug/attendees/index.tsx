import type { LoaderFunction } from "@remix-run/router";
import { json } from "@remix-run/router";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { Attendee } from "~/tournament/attendee-model.server";
import { getTournamentAttendeesByEventSlug } from "~/tournament/attendee-model.server";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiTrash,
} from "react-icons/fi";
import type { ReactNode } from "react";

interface LoaderData {
  attendees: Attendee[];
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(
    params.eventSlug,
    `eventSlug not found in ${JSON.stringify(Object.keys(params))}`
  );

  const attendees = await getTournamentAttendeesByEventSlug(params.eventSlug);

  return json<LoaderData>({ attendees });
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
        <span className="label success hollow">
          <FiCheckCircle /> Paid
        </span>
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
      {getDeleteLink(attendee)}
    </>
  );
}

export default function EventIndexPage() {
  const { attendees } = useLoaderData<typeof loader>();

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
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
              <td>{getStatusTag(attendee)}</td>
              <td>{getActions(attendee)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
