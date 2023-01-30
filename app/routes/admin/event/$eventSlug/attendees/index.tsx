import { json, LoaderFunction } from "@remix-run/router";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  Attendee,
  getTournamentAttendees,
} from "~/tournament/attendee-model.server";
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { ReactNode } from "react";

interface LoaderData {
  attendees: Attendee[];
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(
    params.eventSlug,
    `eventSlug not found in ${JSON.stringify(Object.keys(params))}`
  );

  const attendees = await getTournamentAttendees(params.eventSlug);

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
      <button type="submit" className="button small">
        {attendee.approved ? "Resend Verify Email" : "Approve"}
      </button>
    </form>
  );
}

function getActions(attendee: Attendee): ReactNode {
  return <>{getApprovalLink(attendee)}</>;
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
              <td>{attendee.name}</td>
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
