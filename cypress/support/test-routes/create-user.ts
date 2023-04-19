import type { ActionFunction } from "@remix-run/node";
import {
  setUserPassword,
  createUser,
  registerUserByEmail,
} from "~/account/user-model.server";
import { createUserSession } from "~/account/session.server";
import { assertNonProd } from "./helpers/assert-non-prod";

export const action: ActionFunction = async ({ request }) => {
  assertNonProd();

  const { email } = await request.json();
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  await createUser(`Test User <${email}>`, email, false);
  // noinspection SpellCheckingInspection
  await setUserPassword(email, "myreallystrongpassword");
  await registerUserByEmail(email);

  return createUserSession({
    request,
    email: email,
    remember: true,
    redirectTo: "/",
  });
};

export default null;
