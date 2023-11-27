import arc from "@architect/functions";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";
import { sendEmail } from "~/utils/send-email.server";
import { ProcessRegistrationEmail } from "~/account/process-registration-email";
import { VerifyAccountEmail } from "~/account/verify-account-email";
import { getResetKey } from "~/account/auth.server";
import { v4 } from "uuid";
import type { User } from "~/account/user-model";
import { Role } from "~/account/user-model";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export type Password = { password: string };
export type Session = { sessionId: string; email: string; ttl: Date };

export async function getUsers(): Promise<User[]> {
  const db = await arc.tables();
  const result = await db.user.scan({});
  return result.Items;
}

function userFromRecord(record: any): User {
  return {
    email: record.email,
    name: record.name,
    roles: record.roles,
  };
}

function sessionFromRecord(record: any): Session {
  return {
    sessionId: record.sessionId,
    email: record.email,
    ttl: new Date(record.ttl),
  };
}

export async function getUserByEmail(
  email: User["email"]
): Promise<User | null> {
  const db = await arc.tables();
  const result = await db.user.query({
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email },
  });

  const [record] = result.Items;
  if (record) return userFromRecord(record);
  return null;
}

async function getUserPasswordByEmail(email: User["email"]) {
  const db = await arc.tables();
  const result = await db.password.query({
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email },
  });

  const [record] = result.Items;

  if (record) return { hash: record.password };
  return null;
}

export async function isVerified(user: User): Promise<boolean> {
  return (await getUserPasswordByEmail(user.email)) !== null;
}

export async function createUser(
  name: User["name"],
  email: User["email"],
  shouldSendEmail: boolean = true
) {
  const db = await arc.tables();
  let roles: Role[] = [];

  if (shouldSendEmail) {
    if (email === ADMIN_EMAIL) {
      roles = [Role.Admin];
      const resetKey = await getResetKey(email);
      await sendEmail(new VerifyAccountEmail(name, email, resetKey));
    } else {
      await sendEmail(new ProcessRegistrationEmail(name, email));
    }
  }

  const data = {
    email,
    name,
    roles,
  };

  await db.user.put(data);

  const user = await getUserByEmail(email);
  invariant(user, `User not found after being created. This should not happen`);

  console.log(user)

  return user;
}

export async function setUserPassword(
  email: User["email"],
  password: Password["password"]
) {
  const db = await arc.tables();

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.password.put({
    email: email,
    password: hashedPassword,
  });
}

export async function putUser(user: User): Promise<User> {
  const db = await arc.tables();
  return await db.user.put({
    email: user.email,
    name: user.name,
    roles: user.roles,
  });
}

export async function deleteUser(email: User["email"]) {
  const db = await arc.tables();
  await db.password.delete({ email });
  await db.user.delete({ email });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["password"]
) {
  const userPassword = await getUserPasswordByEmail(email);

  if (!userPassword) {
    return undefined;
  }

  const isValid = await bcrypt.compare(password, userPassword.hash);
  if (!isValid) {
    return undefined;
  }

  const user = await getUserByEmail(email);
  if (!user || !user.roles?.length) {
    return undefined;
  }

  return user;
}

export async function createSessionRecord(
  email: User["email"],
  ttl?: Date
): Promise<string> {
  const db = await arc.tables();
  const sessionId = v4();

  await db.session.put({
    sessionId,
    email,
    ttl: ttl?.getTime() ?? Date.now() + 24 * 60 * 60 * 1000,
  });

  return sessionId;
}

export async function getSessionRecordById(
  sessionId: Session["sessionId"]
): Promise<Session | null> {
  const db = await arc.tables();
  const result = await db.session.query({
    KeyConditionExpression: "sessionId = :sessionId",
    ExpressionAttributeValues: { ":sessionId": sessionId },
  });

  const [record] = result.Items;

  if (record) return sessionFromRecord(record);
  return null;
}

export async function registerUserByEmail(
  email: string,
  roles: Role[] = [Role.Registered]
) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User with that email not found");
  }

  user.roles = [...new Set([...(user.roles ?? []), ...roles])];
  await putUser(user);
  return user;
}
