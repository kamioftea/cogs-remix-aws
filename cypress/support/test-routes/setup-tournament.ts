import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  createUser,
  getUserByEmail,
  registerUserByEmail,
  setUserPassword,
} from "~/account/user-model.server";
import { assertNonProd } from "./helpers/assert-non-prod";
import {
  createAttendee,
  putAttendee,
} from "~/tournament/attendee-model.server";
import { tournaments } from "~/tournament/tournament-model.server";
import { Role } from "~/account/user-model";

function oneOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const action: ActionFunction = async () => {
  assertNonProd();

  const admin_email = "jeff@goblinoid.co.uk";
  const admin_password = "devAdminPassword";

  if (await getUserByEmail(admin_email)) {
    return json({ success: false, error: "already setup" });
  }

  await createUser(`Jeff Horton`, admin_email, false);
  // noinspection SpellCheckingInspection
  await setUserPassword(admin_email, admin_password);
  await registerUserByEmail(admin_email, [Role.Admin]);

  await Promise.all(
    Array.from({ length: 16 }, (_, i) => i + 1).map(async (i) => {
      const attendee = await createAttendee({
        eventSlug: tournaments[0].slug,
        email: `testAttendee${i}@example.org`,
        name: `Test Attendee ${i}`,
        verified: true,
        approved: true,
      });

      await putAttendee({
        ...attendee,
        additionalFields: {
          faction: oneOf([
            "Ogres",
            "The Herd",
            "Brotherhood: Order of the Green Lady",
            "Dwarfs",
          ]),
        },
      });
    })
  );

  return json({ success: true });
};

export default null;
