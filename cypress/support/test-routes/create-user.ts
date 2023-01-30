import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { setUserPassword, createUser } from "~/account/user-model.server";
import { createUserSession } from "~/account/session.server";

export const action: ActionFunction = async ({ request }) => {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 test routes should not be enabled in production 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨"
    );
    // test routes should not be enabled in production or without
    // enable test routes... Just in case this somehow slips through
    // we'll redirect :)
    return redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }

  const { email } = await request.json();
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  await createUser(`Test User <${email}>`, email);
  // noinspection SpellCheckingInspection
  await setUserPassword(email, "myreallystrongpassword");

  return createUserSession({
    request,
    email: email,
    remember: true,
    redirectTo: "/",
  });
};

export default null;
