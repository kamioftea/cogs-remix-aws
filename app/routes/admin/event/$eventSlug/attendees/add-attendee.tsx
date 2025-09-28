import type { ActionFunction } from "@remix-run/router";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import type { Attendee } from "~/tournament/attendee-model.server";
import { createAttendee } from "~/tournament/attendee-model.server";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import FormCheckbox, { checkboxSchema } from "~/form/checkbox";
import FormInput from "~/form/input";
import * as yup from "yup";
import type { ObjectSchema } from "yup";
import { ValidationError } from "yup";
import { getYupErrorMessage } from "~/utils/validation";
import React, { useEffect } from "react";

interface AddAttendeeData {
  name: Attendee["name"];
  email: Attendee["email"];
  paid: Attendee["paid"];
}

const schema: ObjectSchema<AddAttendeeData> = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  paid: checkboxSchema(),
});

interface ActionData {
  errors?: Record<keyof AddAttendeeData, string | undefined>;
  data?: Partial<AddAttendeeData>;
}

export const action: ActionFunction = async ({ request, params }) => {
  const { eventSlug } = params;
  invariant(eventSlug, "From route");
  const tournament = await getTournamentBySlug(eventSlug);
  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }

  const formData = Object.fromEntries(await request.formData());

  let data: AddAttendeeData;
  try {
    data = await schema.validate(formData, { abortEarly: false });
  } catch (err) {
    if (ValidationError.isError(err)) {
      return json<ActionData>(
        {
          errors: {
            name: getYupErrorMessage("name", err),
            email: getYupErrorMessage("email", err),
            paid: getYupErrorMessage("paid", err),
          },
          data: formData,
        },
        400,
      );
    }
    throw err;
  }

  await createAttendee({
    eventSlug: tournament.slug,
    name: data.name,
    email: data.email,
    approved: true,
    verified: true,
    paid: data.paid,
  });

  return redirect(`/admin/event/${eventSlug}/attendees`);
};

export default () => {
  const { data, errors } = (useActionData() ?? {}) as ActionData;

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const paidRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.email) {
      emailRef.current?.focus();
    } else if (errors?.paid) {
      paidRef.current?.focus();
    }
  }, [errors]);

  return (
    <>
      <form method="POST">
        <legend>
          <h1>Add event attendee</h1>
        </legend>
        <FormInput
          label="Name"
          name="name"
          required
          autoFocus
          defaultValue={data?.name}
          error_message={errors?.name}
          ref={nameRef}
        />
        <FormInput
          label="Email"
          name="email"
          required
          defaultValue={data?.email}
          error_message={errors?.email}
          ref={emailRef}
        />
        <FormCheckbox
          label="Paid"
          name="paid"
          defaultChecked={data?.paid}
          error_message={errors?.paid}
          ref={paidRef}
        />
        <button type="submit" className="button primary">
          Confirm
        </button>
      </form>
      <Link to={".."}>Cancel</Link>
    </>
  );
};
