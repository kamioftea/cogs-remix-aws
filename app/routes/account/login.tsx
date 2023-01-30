import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createUserSession, getSessionId } from "~/account/session.server";
import * as React from "react";
import type { SchemaOf } from "yup";
import { ValidationError } from "yup";
import * as yup from "yup";
import { verifyLogin } from "~/account/user-model.server";
import { safeRedirect } from "~/utils";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { getYupErrorMessage } from "~/utils/validation";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionId = await getSessionId(request);
  if (sessionId) return redirect("/account");
  return json({});
};

interface LoginData {
  email: string;
  password: string;
  remember: boolean;
  redirectTo: string;
}

const schema: SchemaOf<LoginData> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(10).required(),
  remember: yup.mixed().transform((s) => s === "on"),
  redirectTo: yup
    .string()
    .default("/account")
    .transform((url) => safeRedirect(url)),
});

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  let loginData: LoginData;
  try {
    loginData = await schema.validate(formData, { abortEarly: false });
  } catch (err) {
    if (ValidationError.isError(err)) {
      return json<ActionData>(
        {
          errors: {
            email: getYupErrorMessage("email", err),
            password: getYupErrorMessage("password", err),
          },
        },
        400
      );
    }
    throw err;
  }

  const user = await verifyLogin(loginData.email, loginData.password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    email: user.email,
    remember: loginData.remember,
    redirectTo: loginData.redirectTo,
  });
};

export default function AccountLoginPage() {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const { errors } = (useActionData() ?? {}) as ActionData;

  useEffect(() => {
    if (errors?.email) {
      emailRef.current?.focus();
    } else if (errors?.password) {
      passwordRef.current?.focus();
    }
  }, [errors]);

  return (
    <>
      <Form method="post" className="credentials-form">
        <h2>Please login</h2>
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
        <label className={errors?.password ? "is-invalid-label" : undefined}>
          Password
          <input
            ref={passwordRef}
            id="password"
            required
            name="password"
            type="password"
            autoComplete="password"
            aria-invalid={errors?.password ? true : undefined}
            aria-describedby="password-error"
            className={errors?.password ? "is-invalid-input" : undefined}
          />
          {errors?.password && (
            <span className="form-error is-visible" id="password-error">
              {errors.password}
            </span>
          )}
        </label>
        <input type="submit" className="button primary" value="Login" />
        <p>
          Problems logging in?{" "}
          <Link to="/account/reset-password">Request a password reset.</Link>
        </p>
        <p>
          Don't have an account? <Link to="/account/register">Sign up.</Link>
        </p>
      </Form>
    </>
  );
}
