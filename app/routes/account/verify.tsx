import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import * as React from "react";
import { useEffect } from "react";
import * as yup from "yup";
import type { ObjectSchema } from "yup";
import { ValidationError } from "yup";
import { setUserPassword } from "~/account/user-model.server";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { getYupErrorMessage } from "~/utils/validation";
import { validateResetKey } from "~/account/auth.server";
import { createUserSession, getSessionId } from "~/account/session.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";

interface LoaderData {
  email: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const sessionId = await getSessionId(request);
  if (sessionId) return redirect("/");

  const user = await validateResetKey(request);
  return json<LoaderData>({ email: user.email });
};

interface VerifyData {
  password: string;
}

const schema: ObjectSchema<VerifyData> = yup.object().shape({
  password: yup.string().min(10).required(),
});

interface ActionData {
  errors?: {
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const sessionId = await getSessionId(request);
  if (sessionId) return redirect("/");

  const user = await validateResetKey(request);

  const formData = Object.fromEntries(await request.formData());
  let verifyData: VerifyData;
  try {
    verifyData = await schema.validate(formData, { abortEarly: false });
  } catch (err) {
    console.log("validate form data", err);
    if (ValidationError.isError(err)) {
      return json<ActionData>(
        {
          errors: {
            password: getYupErrorMessage("password", err),
          },
        },
        400,
      );
    }
    throw err;
  }

  await setUserPassword(user.email, verifyData.password);

  return createUserSession({
    request,
    email: user.email,
    remember: false,
    redirectTo: "/account",
  });
};

export default function AccountRegisterPage() {
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const { email } = useLoaderData<LoaderData>();
  const { errors } = (useActionData() ?? {}) as ActionData;

  useEffect(() => {
    if (errors?.password) {
      passwordRef.current?.focus();
    }
  }, [errors]);

  return (
    <>
      <Form method="post" className="credentials-form">
        <h2>Set a password</h2>
        <p>Please enter a new password for {email}</p>
        <label className={errors?.password ? "is-invalid-label" : undefined}>
          New password
          <input
            ref={passwordRef}
            id="password"
            required
            autoFocus={true}
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
        <input type="submit" className="button primary" value="Set password" />
        <p>
          Not the right email? <Link to="/account/login">Back to log in.</Link>
        </p>
      </Form>
    </>
  );
}

export function CatchBoundary() {
  const caught = useRouteError();

  if (isRouteErrorResponse(caught)) {
    return (
      <ErrorPage heading={caught.data.heading}>
        <div dangerouslySetInnerHTML={{ __html: caught.data.message }} />
      </ErrorPage>
    );
  }

  return <GenericErrorPage />;
}
