import type { ActionFunction, LoaderFunction } from "@remix-run/router";
import { json, redirect } from "@remix-run/router";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import * as React from "react";
import { useEffect } from "react";
import {
  Form,
  Link,
  useActionData,
  useCatch,
  useRouteLoaderData,
} from "@remix-run/react";
import { FiCheck } from "react-icons/fi";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import * as yup from "yup";
import type { ObjectSchema } from "yup";
import { ValidationError } from "yup";
import { getYupErrorMessage } from "~/utils/validation";
import { sendEmail } from "~/utils/send-email.server";
import { getAttendeeKey } from "~/account/auth.server";
import { getTournamentAttendee } from "~/tournament/attendee-model.server";
import { EditAttendeeDetailsEmail } from "~/tournament/edit-attendee-details-email";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import { getUser } from "~/account/session.server";

const breadcrumbs: Breadcrumb[] = [
  { label: "Request Edit Link", url: CURRENT },
];

export const handle = { breadcrumbs };

interface RequestData {
  email: string;
}

const schema: ObjectSchema<RequestData> = yup.object().shape({
  email: yup.string().email().required(),
});

interface ActionData {
  errors?: {
    email?: string;
  };
  emailSent?: boolean;
  email?: string;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  const user = await getUser(request);
  if (user) {
    const attendee = await getTournamentAttendee(params.eventId, user.email);
    return attendee
      ? redirect(`/event/${params.eventId}/edit-details`)
      : redirect(`/event/${params.eventId}/sign-up`);
  }

  return json({});
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament || !tournament.eventPack) {
    throw new Response("No online rules pack for this event", { status: 404 });
  }

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
        400,
      );
    }
    throw err;
  }

  const attendee = await getTournamentAttendee(
    tournament.slug,
    requestData.email,
  );
  if (!attendee) {
    return json<ActionData>({
      errors: {
        email: `No ${tournament.title} attendee found with that email.`,
      },
    });
  }

  if (!attendee.approved) {
    return json<ActionData>({
      errors: {
        email: `The attendee for that email is awaiting admin approval.`,
      },
    });
  }

  await sendEmail(
    new EditAttendeeDetailsEmail(
      attendee.name,
      attendee.email,
      tournament.slug,
      tournament.title,
      await getAttendeeKey(attendee.email, tournament.slug),
    ),
  );

  return json<ActionData>({ emailSent: true, email: attendee.email });
};

export default function SendEditLinkPage() {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId",
  ) as TournamentLoaderData;

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
          <FiCheck /> Edit link sent
        </h2>
        <p>
          Thanks. An email with a link to edit your account details has been
          sent to {email}.
        </p>
        <p>
          <Link to={`/event/${tournament.slug}`}>
            Return to {tournament.title} event page.
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <Form method="post" className="credentials-form">
        <h2>Request a link to edit your details</h2>
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
          If you have an account you can{" "}
          <Link to={`/account/login`}>Log In</Link> to edit your details without
          needing a link.
        </p>
        <p>
          Don't need edit your details?{" "}
          <Link to={`/event/${tournament.slug}`}>
            Return to {tournament.title} event page.
          </Link>
        </p>
        <p>
          Not yet registered for {tournament.title} ?{" "}
          <Link to={`/event/${tournament.slug}/sign-up`}>Sign up.</Link>
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
