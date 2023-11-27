import Iron from "@hapi/iron";
import { getUserByEmail } from "~/account/user-model.server";
import { json } from "@remix-run/node";
import { unsafeRenderMarkdown } from "~/utils/markdown";
import type { Attendee } from "~/tournament/attendee-model.server";
import { getTournamentAttendee } from "~/tournament/attendee-model.server";
import invariant from "tiny-invariant";
import type { User } from "~/account/user-model";

const TOKEN_SECRET =
  process.env.TOKEN_SECRET || "change-me-to-a-32-character-or-longer-string";

const MAX_AGE = 60 * 60 * 24;

interface AccessToken {
  email: string;
  purpose: "user" | "attendee";
  eventSlug?: Attendee["eventSlug"];
  createdAt: number;
}

export async function getResetKey(email: User["email"]): Promise<string> {
  return getAccessKey(email, "user");
}

export async function getAttendeeKey(
  email: Attendee["email"],
  eventSlug: Attendee["eventSlug"]
): Promise<string> {
  return getAccessKey(email, "attendee", eventSlug);
}

export async function getAccessKey(
  email: AccessToken["email"],
  purpose: AccessToken["purpose"],
  eventSlug?: Attendee["eventSlug"]
): Promise<string> {
  console.log(TOKEN_SECRET)

  return await Iron.seal(
    { email, purpose, eventSlug, createdAt: Date.now() },
    TOKEN_SECRET,
    Iron.defaults
  );
}

const loginMessage = unsafeRenderMarkdown(`
You can request a new link using the [forgotten password form](/account/forgotten).
  `);

const attendeeMessage = (eventSlug: Attendee["eventSlug"]) =>
  unsafeRenderMarkdown(`
You can request a new link using the [get edit link form](/event/${eventSlug}/edit-details).
  `);

async function validateToken(token: string): Promise<AccessToken> {
  try {
    return (await Iron.unseal(
      token,
      TOKEN_SECRET,
      Iron.defaults
    )) as AccessToken;
  } catch (err) {
    throw json(
      {
        heading: "Failed to read reset token",
        message: loginMessage,
      },
      { status: 400 }
    );
  }
}

export async function validateResetKey(request: Request): Promise<User> {
  const accessToken = await validateAccessKey(request, "user", loginMessage);

  const user = await getUserByEmail(accessToken.email);
  if (!user) {
    throw json(
      {
        heading: "Reset token is not for an active user",
        message: loginMessage,
      },
      { status: 400 }
    );
  }

  return user;
}

export async function validateAttendeeKey(
  request: Request,
  eventSlug: Attendee["eventSlug"]
): Promise<Attendee> {
  const message = attendeeMessage(eventSlug);
  const accessToken = await validateAccessKey(request, "attendee", message);

  invariant(accessToken.eventSlug, "Always set for attendee purpose");

  const attendee = await getTournamentAttendee(
    accessToken.eventSlug,
    accessToken.email
  );
  if (!attendee) {
    throw json(
      {
        heading: "Access token is not for an active attendee",
        message: loginMessage,
      },
      { status: 400 }
    );
  }

  return attendee;
}

export async function validateAccessKey(
  request: Request,
  expectedPurpose: AccessToken["purpose"],
  message: string
): Promise<AccessToken> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    throw json(
      {
        heading: "Access token was missing",
        message,
      },
      { status: 400 }
    );
  }

  const accessToken = await validateToken(token);

  const expiresAt = accessToken.createdAt + MAX_AGE * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt || Date.now() < accessToken.createdAt) {
    throw json(
      {
        heading: "Access token has expired",
        message,
      },
      { status: 400 }
    );
  }

  // Validate the purpose
  if (accessToken.purpose !== expectedPurpose) {
    throw json(
      {
        heading: "Access token was created for a different purpose",
        message,
      },
      { status: 400 }
    );
  }

  return accessToken;
}
