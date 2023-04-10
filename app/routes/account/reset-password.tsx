import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import * as React from "react";
import { useEffect } from "react";
import type { SchemaOf } from "yup";
import * as yup from "yup";
import { ValidationError } from "yup";
import { ADMIN_EMAIL, getUserByEmail } from "~/account/user-model.server";
import { Form, Link, useActionData, useCatch } from "@remix-run/react";
import { getYupErrorMessage } from "~/utils/validation";
import { getResetKey } from "~/account/auth.server";
import { getSessionId } from "~/account/session.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { sendEmail } from "~/utils/send-email.server";
import { ResetPasswordEmail } from "~/account/reset-password-email";
import { FiCheck } from "react-icons/fi";

interface LoaderData {}

export const loader: LoaderFunction = async ({ request }) => {
  const sessionId = await getSessionId(request);
  if (sessionId) return redirect("/");

  return json<LoaderData>({});
};

interface RequestData {
  email: string;
}

const schema: SchemaOf<RequestData> = yup.object().shape({
  email: yup.string().email().required(),
});

interface ActionData {
  errors?: {
    email?: string;
  };
  emailSent?: boolean;
  email?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const sessionId = await getSessionId(request);
  if (sessionId) return redirect("/");

  const formData = Object.fromEntries(await request.formData());
  let requestData: RequestData;
  try {
    requestData = await schema.validate(formData, { abortEarly: false });
  } catch (err) {
    if (ValidationError.isError(err)) {
      return json<ActionData>(
        {
          errors: {
            email: getYupErrorMessage("email", err),
          },
        },
        400
      );
    }
    throw err;
  }

  const user = await getUserByEmail(requestData.email);
  if (!user || (!user.roles && user.email !== ADMIN_EMAIL)) {
    return json<ActionData>({
      errors: {
        email: "No active user found with that email.",
      },
    });
  }

  await sendEmail(
    new ResetPasswordEmail(user.name, user.email, await getResetKey(user.email))
  );

  return json<ActionData>({ emailSent: true });
};

export default function ResetPasswordPage() {
  const emailRef = React.useRef<HTMLInputElement>(null);

  const { errors, emailSent, email } = (useActionData() ?? {}) as ActionData;

  useEffect(() => {
    if (errors?.email) {
      emailRef.current?.focus();
    }
  }, [errors]);

  if (emailSent === true) {
    return (
      <>
        <h2>
          <FiCheck /> Reset email sent
        </h2>
        <p>
          Thanks. An email with a link to reset the password for your account
          has been sent to {email}.
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
        <h2>Request a password reset</h2>
        <input name={email} type="hidden" value={email} />
        <label className={errors?.email ? "is-invalid-label" : undefined}>
          Email
          <input
            ref={emailRef}
            id="name"
            required
            autoFocus={true}
            name="email"
            type="text"
            autoComplete="email"
            aria-invalid={errors?.email ? true : undefined}
            aria-describedby="email-error"
            className={errors?.email ? "is-invalid-input" : undefined}
          />
          {errors?.email && (
            <span className="form-error is-visible" id="email-error">
              {errors.email}
            </span>
          )}
        </label>
        <input type="submit" className="button primary" value="Request reset" />
        <p>
          Don't need a password reset?{" "}
          <Link to="/account/login">Back to log in.</Link>
        </p>
        <p>
          Don't have an account? <Link to="/account/register">Sign up.</Link>
        </p>
      </Form>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.data.heading && caught.data.message) {
    return (
      <ErrorPage heading={caught.data.heading}>
        <div dangerouslySetInnerHTML={{ __html: caught.data.message }} />
      </ErrorPage>
    );
  }

  return <GenericErrorPage />;
}
