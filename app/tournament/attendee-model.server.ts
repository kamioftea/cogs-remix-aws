import arc from "@architect/functions";

import type { User } from "~/account/user-model";
import { slugify } from "~/utils/slugify";
import { purgeUndefined } from "~/utils/purgeUndefined";

export type Attendee = {
  eventSlug: string;
  email: User["email"];
  slug: string;
  name: string;
  approved: boolean;
  verified: boolean;
  paid: boolean;
  created: Date;
  additionalFields: Record<string, string>;
  scoresPerRound?: number[];
  routedPerRound?: number[];
  bonusPoints?: number;
  paintBallot?: Record<string, number>;
  sportsBallot?: Record<string, number>;
};

function recordToAttendee(record: any): Attendee {
  return {
    eventSlug: record.eventSlug,
    email: record.email,
    slug: record.slug,
    name: record.name,
    approved: record.approved,
    verified: record.verified,
    paid: record.paid,
    created: new Date(record.created),
    additionalFields: record.additionalFields,
    scoresPerRound: record.scoresPerRound,
    routedPerRound: record.routedPerRound,
    bonusPoints: record.bonusPoints,
    paintBallot: record.paintBallot,
    sportsBallot: record.sportsBallot,
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

export async function listTournamentAttendeesByEventSlug(
  eventSlug: Attendee["eventSlug"]
): Promise<Attendee[]> {
  const db = await arc.tables();

  const result = await db.attendee.query({
    KeyConditionExpression: "eventSlug = :eventSlug",
    ExpressionAttributeValues: { ":eventSlug": eventSlug },
  });

  return (
    result?.Items.map(recordToAttendee).sort(
      (a, b) => a.created.getTime() - b.created.getTime()
    ) ?? []
  );
}

export async function listTournamentAttendeesByEmail(
  email: Attendee["email"]
): Promise<Attendee[]> {
  const db = await arc.tables();

  const result = await db.attendee.query({
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email },
    IndexName: "byEmail",
  });

  return (
    result?.Items.map(recordToAttendee).sort(
      (a, b) => a.created.getTime() - b.created.getTime()
    ) ?? []
  );
}

export async function getTournamentAttendeeBySlug(
  eventSlug: Attendee["eventSlug"],
  slug: Attendee["slug"]
): Promise<Attendee> {
  const db = await arc.tables();

  const result = await db.attendee.query({
    KeyConditionExpression: "eventSlug = :eventSlug AND slug = :slug",
    ExpressionAttributeValues: { ":eventSlug": eventSlug, ":slug": slug },
    IndexName: "bySlugs",
  });

  return result?.Items.map(recordToAttendee)[0];
}

async function getUniqueSlug(name: string, eventSlug: string) {
  let index = 0;
  let slugExists;
  let slug;

  do {
    slug = `${slugify(name)}${index > 0 ? `-${index}` : ""}`;

    const result = await getTournamentAttendeeBySlug(eventSlug, slug);

    slugExists = !!result;
    index++;
  } while (slugExists);

  return slug;
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

  let slug = await getUniqueSlug(name, eventSlug);

  const result = await db.attendee.put({
    eventSlug,
    email,
    slug,
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

  const result = await db.attendee.put(
    purgeUndefined({
      eventSlug: attendee.eventSlug,
      email: attendee.email,
      slug: attendee.slug,
      name: attendee.name,
      approved: attendee.approved,
      verified: attendee.verified,
      paid: attendee.paid,
      created: attendee.created.getTime(),
      additionalFields: attendee.additionalFields,
      scoresPerRound: attendee.scoresPerRound ?? [],
      routedPerRound: attendee.routedPerRound ?? [],
      bonusPoints: attendee.bonusPoints ?? 0,
      paintBallot: attendee.paintBallot ?? {},
      sportsBallot: attendee.sportsBallot ?? {},
    })
  );

  return recordToAttendee(result);
}

export async function deleteAttendee(
  email: Attendee["email"],
  eventSlug: Attendee["eventSlug"]
) {
  const db = await arc.tables();

  await db.attendee.delete({ email, eventSlug });
}

export interface AttendeeDisplayData {
  name: string;
  faction: string;
  army_list?: string;
}

const attendeeToDisplayData = ({ name, additionalFields }: Attendee) => ({
  name,
  faction: `${additionalFields?.faction}${
    additionalFields?.allies ? ` with allied ${additionalFields.allies}` : ""
  }`,
  army_list: additionalFields?.army_list,
});

export async function attendeeDisplayDataBySlug(
  eventSlug: string
): Promise<Record<string, AttendeeDisplayData>> {
  return Object.fromEntries(
    (await listTournamentAttendeesByEventSlug(eventSlug)).map((a) => [
      a.slug,
      attendeeToDisplayData(a),
    ])
  );
}
