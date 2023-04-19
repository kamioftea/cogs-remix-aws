import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { Session } from "~/account/user-model.server";
import {
  createSessionRecord,
  getSessionRecordById,
  getUserByEmail,
} from "~/account/user-model.server";
import type { Role, User } from "~/account/user-model";
import type {
  Attendee} from "~/tournament/attendee-model.server";
import {
  getTournamentAttendee,
} from "~/tournament/attendee-model.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "sessionId";

export async function getSessionHeader(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getSessionId(
  request: Request
): Promise<Session["sessionId"] | undefined> {
  const session = await getSessionHeader(request);
  return session.get(USER_SESSION_KEY);
}

async function getSession(request: Request): Promise<Session | null> {
  const sessionId = await getSessionId(request);
  if (sessionId === undefined) return null;

  const session = await getSessionRecordById(sessionId);
  if (!session || session.ttl.getTime() < Date.now()) {
    throw await logout(request, request.url);
  }

  return session;
}

export async function getSessionEmail(
  request: Request
): Promise<string | undefined> {
  const session = await getSession(request);
  return session?.email;
}

export async function getUser(request: Request): Promise<User | null> {
  const session = await getSession(request);
  if (!session) return null;

  return await getUserByEmail(session.email);
}

export async function getSessionAttendee(
  request: Request,
  eventSlug: string
): Promise<Attendee | null> {
  const session = await getSession(request);
  if (!session) return null;

  const attendee = await getTournamentAttendee(eventSlug, session.email);

  return attendee?.approved ? attendee : null;
}

export async function requireUser(
  request: Request,
  roles?: Role[]
): Promise<User> {
  const user = await getUser(request);

  if (!user) throw await logout(request);
  if (!roles) {
    return user;
  }

  for (const role of roles) {
    if (user.roles?.includes(role)) {
      return user;
    }
  }

  throw redirect("/", 403);
}

export async function createUserSession({
  request,
  email,
  remember = false,
  redirectTo,
}: {
  request: Request;
  email: string;
  remember?: boolean;
  redirectTo?: string;
}) {
  const sessionHeader = await getSessionHeader(request);
  const maxAge = remember ? 60 * 60 * 24 * 365 : undefined;
  const ttl = maxAge ? new Date(1000 * maxAge) : undefined;
  const sessionId = await createSessionRecord(email, ttl);
  sessionHeader.set(USER_SESSION_KEY, sessionId);
  return redirect(redirectTo ?? "/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(sessionHeader, {
        maxAge,
      }),
    },
  });
}

export async function logout(request: Request, redirectUrl?: string) {
  const session = await getSessionHeader(request);
  return redirect(redirectUrl ?? "/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
