import type { ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { assertNonProd } from "./helpers/assert-non-prod";
import invariant from "tiny-invariant";
import { registerUserByEmail } from "~/account/user-model.server";
import { getResetKey } from "~/account/auth.server";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export const action: ActionFunction = async ({ params }) => {
  assertNonProd();

  const { email } = params;
  invariant(email, "From route");

  console.log({email})

  try {
    await registerUserByEmail(email);
  } catch (err) {
    throw new Response(`User not found with email ${email}`, { status: 404 });
  }

  const resetKey = await getResetKey(email);
  const verifyURL = new URL(`${BASE_URL}/account/verify/`);
  verifyURL.searchParams.set("token", resetKey);

  console.log({ verifyURL, email })
  return json({redirect: verifyURL.toString()});
}

export default null;
