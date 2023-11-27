import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSessionId } from "~/account/session.server";
import * as React from "react";
import type { ObjectSchema } from "yup";
import { ValidationError } from "yup";
import * as yup from "yup";
import { getUserByEmail } from "~/account/user-model.server";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { getYupErrorMessage } from "~/utils/validation";
import { createUser } from "~/account/user-model.server";
import { FiCheck } from "react-icons/fi";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionId = await getSessionId(request);
  if (sessionId) return redirect("/account");
  return json({});
};

interface RegisterData {
  name: string;
  email: string;
}

const schema: ObjectSchema<RegisterData> = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

interface ActionData {
  errors?: {
    name?: string;
    email?: string;
  };
  accountCreated?: boolean;
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

  console.log({registerData});

  await createUser(registerData.name, registerData.email);

  console.log('created')

  return json<ActionData>({ accountCreated: true });
};

export default function AccountRegisterPage() {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  const { errors, accountCreated } = (useActionData() ?? {}) as ActionData;

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.email) {
      emailRef.current?.focus();
    }
  }, [errors]);

  if (accountCreated === true) {
    return (
      <>
        <h2>
          <FiCheck /> Registration Requested
        </h2>
        <p className="lead">
          Thanks, your account registration has been received.
        </p>

        <h3>What happens now?</h3>
        <p>
          One of the organisers will approve your request. Once this happens you
          will receive an email that will allow you to verify your email and set
          up a password.
        </p>
        <p>
          If you haven't received an email within a couple of days, please
          contact <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a>
          .
        </p>
        <p>
          <Link to="/">Return to Kings of War homepage.</Link>
        </p>
      </>
    );
  }

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
            aria-describedby="name-error"
            className={errors?.name ? "is-invalid-input" : undefined}
          />
          {errors?.name && (
            <span className="form-error is-visible" id="name-error">
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
        <p>
          Already have an account? <Link to="/account/login">Log in.</Link>
        </p>
      </Form>
    </>
  );
}
