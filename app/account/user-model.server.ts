import arc from "@architect/functions";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";
import { sendEmail } from "~/utils/send-email.server";
import { ProcessRegistrationEmail } from "~/account/process-registration-email";
import { VerifyAccountEmail } from "~/account/verify-account-email";
import { getResetKey } from "~/account/auth.server";

export enum Role {
  Admin = "Admin",
  Registered = "Registered",
}

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export type User = {
  id: `email#${string}`;
  email: string;
  name?: string;
  roles?: Role[];
};
export type Password = { password: string };

export async function getUsers(): Promise<User[]> {
  const db = await arc.tables();
  const result = await db.user.scan({});
  return result.Items;
}

function userFromRecord(record: any) {
  return {
    id: record.pk,
    email: record.email,
    name: record.name,
    roles: record.roles,
  };
}

export async function getUserById(id: User["id"]): Promise<User | null> {
  const db = await arc.tables();
  const result = await db.user.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": id },
  });

  const [record] = result.Items;
  if (record) return userFromRecord(record);
  return null;
}

export async function getUserByEmail(email: User["email"]) {
  return getUserById(`email#${email}`);
}

async function getUserPasswordByEmail(email: User["email"]) {
  const db = await arc.tables();
  const result = await db.password.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": `email#${email}` },
  });

  const [record] = result.Items;

  if (record) return { hash: record.password };
  return null;
}

export async function createUser(name: User["name"], email: User["email"]) {
  const db = await arc.tables();
  let roles: Role[] = [];
  if (email === ADMIN_EMAIL) {
    roles = [Role.Admin];
    const resetKey = await getResetKey(email);
    await sendEmail(new VerifyAccountEmail(name, email, resetKey));
  } else {
    await sendEmail(new ProcessRegistrationEmail(name, email));
  }

  const data = {
    pk: `email#${email}`,
    email,
    name,
    roles,
  };

  await db.user.put(data);

  const user = await getUserByEmail(email);
  invariant(user, `User not found after being created. This should not happen`);

  return user;
}

export async function setUserPassword(
  email: User["email"],
  password: Password["password"]
) {
  const db = await arc.tables();

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.password.put({
    pk: `email#${email}`,
    password: hashedPassword,
  });
}

export async function deleteUser(email: User["email"]) {
  const db = await arc.tables();
  await db.password.delete({ pk: `email#${email}` });
  await db.user.delete({ pk: `email#${email}` });
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
