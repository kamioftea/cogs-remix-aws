import type { ActionFunction, LoaderFunction } from "@remix-run/router";
import { redirect } from "@remix-run/router";
import { sendEmail } from "~/utils/send-email.server";
import { getResetKey } from "~/account/auth.server";
import { registerUserByEmail } from "~/account/user-model.server";
import invariant from "tiny-invariant";
import { VerifyAccountEmail } from "~/account/verify-account-email";

export const action: ActionFunction = async ({ params }) => {
  const { email } = params;
  invariant(email, "From route");

  let user;
  try {
    user = await registerUserByEmail(email);
  } catch (err) {
    throw new Response("Event attendee not found", { status: 404 });
  }

  const accessKey = await getResetKey(email);
  await sendEmail(new VerifyAccountEmail(user.name, user.email, accessKey));

  return redirect(`/admin/user`);
};

export const loader: LoaderFunction = () => {
  throw new Response("Method not supported", { status: 405 });
};
