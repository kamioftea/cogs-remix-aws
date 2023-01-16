import Iron from "@hapi/iron";
import { getUserByEmail, User } from "~/account/user-model.server";
import { json } from "@remix-run/node";
import { unsafeRenderMarkdown } from "~/utils/markdown";

const TOKEN_SECRET =
  process.env.TOKEN_SECRET || "change-me-to-a-32-character-or-longer-string";

const MAX_AGE = 60 * 60 * 24;

interface ResetToken {
  email: User["email"];
  createdAt: number;
}

export async function getResetKey(email: User["email"]): Promise<string> {
  return await Iron.seal(
    { email, createdAt: Date.now() },
    TOKEN_SECRET,
    Iron.defaults
  );
}

const message = unsafeRenderMarkdown(`
You can request a new link using the [forgotten password form](/account/forgotten).
  `);

async function validateToken(token: string): Promise<ResetToken> {
  try {
    return (await Iron.unseal(
      token,
      TOKEN_SECRET,
      Iron.defaults
    )) as ResetToken;
  } catch (err) {
    throw json(
      {
        heading: "Failed to read reset token",
        message,
      },
      { status: 400 }
    );
  }
}

export async function validateResetKey(request: Request): Promise<User> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    throw json(
      {
        heading: "Reset token was missing",
        message,
      },
      { status: 400 }
    );
  }

  const { email, createdAt } = await validateToken(token);

  console.log({ email, createdAt });

  const expiresAt = createdAt + MAX_AGE * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt || Date.now() < createdAt) {
    throw json(
      {
        heading: "Reset token has expired",
        message,
      },
      { status: 400 }
    );
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw json(
      {
        heading: "Reset token is not for an active user",
        message,
      },
      { status: 400 }
    );
  }

  return user;
}
