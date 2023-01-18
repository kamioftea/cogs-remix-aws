import type {
  ActionFunction,
  LoaderFunction} from "@remix-run/node";
import {
  json,
  redirect,
} from "@remix-run/node";
import { getUserId } from "~/session.server";
import * as React from "react";
import type { SchemaOf} from "yup";
import { ValidationError } from "yup";
import * as yup from "yup";
import { getUserByEmail } from "~/account/user-model.server";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { getYupErrorMessage } from "~/utils/validation";
import { createUser } from "~/account/user-model.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/account");
  return json({});
};

interface RegisterData {
  name: string;
  email: string;
}

const schema: SchemaOf<RegisterData> = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

interface ActionData {
  errors?: {
    name?: string;
    email?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  let registerData: RegisterData;
  try {
    registerData = await schema.validate(formData, { abortEarly: false });
  } catch (err) {
    if (ValidationError.isError(err)) {
      return json<ActionData>(
        {
          errors: {
            name: getYupErrorMessage("name", err),
            email: getYupErrorMessage("email", err),
          },
        },
        400
      );
    }
    throw err;
  }

  const user = await getUserByEmail(registerData.email);
  if (user) {
    return json<ActionData>(
      { errors: { email: "A user with that email has already registered" } },
      { status: 400 }
    );
  }

  await createUser(registerData.name, registerData.email);

  return redirect("/account/registration-pending");
};

export default function AccountRegisterPage() {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  const { errors } = (useActionData() ?? {}) as ActionData;

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.email) {
      emailRef.current?.focus();
    }
  }, [errors]);

  return (
    <>
      <Form method="post" className="credentials-form">
        <h2>Register for an account</h2>
        <label className={errors?.name ? "is-invalid-label" : undefined}>
          Name
          <input
            ref={nameRef}
            id="name"
            required
            autoFocus={true}
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={errors?.name ? true : undefined}
            aria-describedby="password-error"
            className={errors?.name ? "is-invalid-input" : undefined}
          />
          {errors?.name && (
            <span className="form-error is-visible" id="password-error">
              {errors.name}
            </span>
          )}
        </label>
        <label className={errors?.email ? "is-invalid-label" : undefined}>
          Email
          <input
            ref={emailRef}
            id="email"
            required
            autoFocus={true}
            name="email"
            type="text"
            autoComplete="email"
            aria-invalid={errors?.email ? true : undefined}
            aria-describedby="email-error"
          />
          {errors?.email && (
            <span className="form-error is-visible" id="email-error">
              {errors.email}
            </span>
          )}
        </label>
        <input type="submit" className="button primary" value="Register" />
        Already have an account? <Link to="/account/login">Log in.</Link>
      </Form>
    </>
  );
}
