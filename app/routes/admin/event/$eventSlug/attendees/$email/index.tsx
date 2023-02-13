import type { ActionFunction, LoaderFunction } from "@remix-run/router";
import { json, redirect } from "@remix-run/router";
import invariant from "tiny-invariant";
import type { Tournament } from "~/tournament/tournament-model.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import type { Attendee } from "~/tournament/attendee-model.server";
import {
  deleteAttendee,
  getTournamentAttendee,
  putAttendee,
} from "~/tournament/attendee-model.server";
import { useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import FormInput from "~/form/input";
import type { SchemaOf } from "yup";
import { ValidationError } from "yup";
import * as yup from "yup";
import { getYupErrorMessage } from "~/utils/validation";
import FormCheckbox from "~/form/checkbox";
import { useEffect } from "react";
import { sendEmail } from "~/utils/send-email.server";
import { VerifyAttendeeEmail } from "~/tournament/verify-attendee-email";
import { getAttendeeKey } from "~/account/auth.server";

interface LoaderData {
  tournament: Tournament;
  attendee: Attendee;
}

export const loader: LoaderFunction = async ({ params }) => {
  const { eventSlug, email } = params;
  invariant(eventSlug && email, "From route");
  const tournament = getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament attendee not found", { status: 404 });
  }

  const attendee = await getTournamentAttendee(eventSlug, email);
  if (!attendee) {
    throw new Response("Event attendee not found", { status: 404 });
  }

  return json<LoaderData>({ tournament, attendee });
};

interface ActionData {
  errors?: Record<keyof UpdateData, string | undefined>;
  attendeeCreated?: boolean;
  emailSent?: boolean;
}

interface UpdateData {
  name: Attendee["name"];
  email: Attendee["email"];
  approved: Attendee["approved"];
  verified: Attendee["verified"];
  paid: Attendee["paid"];
}

const schema: SchemaOf<UpdateData> = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  approved: yup
    .mixed()
    .transform((s) => s === "on")
    .default(false),
  verified: yup
    .mixed()
    .transform((s) => s === "on")
    .default(false),
  paid: yup
    .mixed()
    .transform((s) => s === "on")
    .default(false),
});

export const action: ActionFunction = async ({ request, params }) => {
  const { eventSlug, email } = params;
  invariant(eventSlug && email, "From route");
  const tournament = getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament attendee not found", { status: 404 });
  }

  const attendee = await getTournamentAttendee(eventSlug, email);
  if (!attendee) {
    throw new Response("Event attendee not found", { status: 404 });
  }

  const formData = Object.fromEntries(await request.formData());

  let data: UpdateData;
  try {
    data = await schema.validate(formData, { abortEarly: false });
  } catch (err) {
    if (ValidationError.isError(err)) {
      return json<ActionData>(
        {
          errors: {
            name: getYupErrorMessage("name", err),
            email: getYupErrorMessage("email", err),
            approved: getYupErrorMessage("approved", err),
            verified: getYupErrorMessage("verified", err),
            paid: getYupErrorMessage("paid", err),
          },
        },
        400
      );
    }
    throw err;
  }

  await putAttendee({ ...attendee, ...data });

  if (attendee.email != data.email) {
    await deleteAttendee(attendee.email, attendee.eventSlug);
  }

  if (!attendee.approved && data.approved && !data.verified) {
    const accessKey = await getAttendeeKey(attendee.email, eventSlug);
    await sendEmail(
      new VerifyAttendeeEmail(
        attendee.name,
        attendee.email,
        eventSlug,
        tournament.title,
        accessKey
      )
    );
  }

  return redirect(`/admin/event/${tournament.slug}/attendees`);
};

export default function ManageAttendeePage() {
  const { attendee, tournament } = useLoaderData<typeof loader>() as LoaderData;

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const approvedRef = React.useRef<HTMLInputElement>(null);
  const verifiedRef = React.useRef<HTMLInputElement>(null);
  const paidRef = React.useRef<HTMLInputElement>(null);

  const { errors } = (useActionData() ?? {}) as ActionData;

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.email) {
      emailRef.current?.focus();
    } else if (errors?.approved) {
      approvedRef.current?.focus();
    } else if (errors?.verified) {
      verifiedRef.current?.focus();
    } else if (errors?.paid) {
      paidRef.current?.focus();
    }
  }, [errors]);

  return (
    <>
      <h2>
        {attendee.name} &lt;{attendee.email}&gt; for {tournament.title}
      </h2>
      <form method="post">
        <FormInput
          label="Name"
          name="name"
          required
          autoFocus
          defaultValue={attendee.name}
          error_message={errors?.name}
        />
        <FormInput
          label="Email"
          name="email"
          required
          defaultValue={attendee.email}
          error_message={errors?.email}
        />
        <FormCheckbox
          label="Approved"
          name="approved"
          defaultChecked={attendee.approved}
          error_message={errors?.approved}
        />
        <FormCheckbox
          label="Verified"
          name="verified"
          defaultChecked={attendee.verified}
          error_message={errors?.verified}
        />
        <FormCheckbox
          label="Paid"
          name="paid"
          defaultChecked={attendee.paid}
          error_message={errors?.paid}
        />
        <button type="submit" className="button primary">
          Update
        </button>
      </form>
    </>
  );
}
