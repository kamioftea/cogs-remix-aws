import arc from "@architect/functions";

import type { User } from "~/account/user-model.server";

export type Attendee = {
  eventSlug: string;
  email: User["email"];
  name: string;
  approved: boolean;
  verified: boolean;
  paid: boolean;
  created: Date;
};

function recordToAttendee(record: any): Attendee {
  return {
    eventSlug: record.eventSlug,
    email: record.email,
    name: record.name,
    approved: record.approved,
    verified: record.verified,
    paid: record.paid,
    created: new Date(record.created),
  };
}

export async function getTournamentAttendee(
  eventSlug: Attendee["eventSlug"],
  email: Attendee["email"]
): Promise<Attendee | null> {
  const db = await arc.tables();

  const result = await db.attendee.get({ eventSlug, email });

  return result ? recordToAttendee(result) : null;
}

export async function getTournamentAttendees(
  eventSlug: Attendee["eventSlug"]
): Promise<Attendee[]> {
  const db = await arc.tables();

  const result = await db.attendee.query({
    KeyConditionExpression: "eventSlug = :eventSlug",
    ExpressionAttributeValues: { ":eventSlug": eventSlug },
  });

  return result?.Items.map(recordToAttendee) ?? [];
}

export async function createAttendee({
  eventSlug,
  email,
  name,
  approved,
  verified,
}: Pick<
  Attendee,
  "eventSlug" | "email" | "name" | "approved" | "verified"
>): Promise<Attendee> {
  const db = await arc.tables();

  const result = await db.attendee.put({
    eventSlug,
    email,
    name,
    approved,
    verified,
    paid: false,
    created: Date.now(),
  });

  return recordToAttendee(result);
}

export async function putAttendee(attendee: Attendee): Promise<Attendee> {
  const db = await arc.tables();

  const result = await db.attendee.put({
    eventSlug: attendee.eventSlug,
    email: attendee.email,
    name: attendee.name,
    approved: attendee.approved,
    verified: attendee.verified,
    paid: attendee.paid,
    created: attendee.created.getTime(),
  });

  return recordToAttendee(result);
}
