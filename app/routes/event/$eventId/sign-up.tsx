import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import * as React from "react";
import { useEffect } from "react";
import type { SchemaOf } from "yup";
import * as yup from "yup";
import { ValidationError } from "yup";
import { getUserByEmail, isVerified } from "~/account/user-model.server";
import {
  Form,
  Link,
  useActionData,
  useRouteLoaderData,
} from "@remix-run/react";
import { getYupErrorMessage } from "~/utils/validation";
import { FiCheck } from "react-icons/fi";
import invariant from "tiny-invariant";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import {
  createAttendee,
  getTournamentAttendee,
} from "~/tournament/attendee-model.server";
import { sendEmail } from "~/utils/send-email.server";
import { VerifyAttendeeEmail } from "~/tournament/verify-attendee-email";
import { getAttendeeKey } from "~/account/auth.server";
import { ProcessAttendeeRegistrationEmail } from "~/tournament/process-attendee-registration-email";
import { TournamentLoaderData } from "~/routes/event/$eventId";
import { useOptionalUser } from "~/utils";
import { Breadcrumb, CURRENT } from "~/utils/breadcrumbs";
import { getUser } from "~/account/session.server";
import { redirect } from "@remix-run/router";

interface SignUpData {
  name: string;
  email: string;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const user = await getUser(request);
  if (user && (await getTournamentAttendee(params.eventId, user.email))) {
    return redirect(`/event/${params.eventId}/edit-details`);
  }

  return json({});
};

const breadcrumbs: Breadcrumb[] = [{ label: "Sign Up", url: CURRENT }];

export const handle = { breadcrumbs };

const schema: SchemaOf<SignUpData> = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

interface ActionData {
  errors?: {
    name?: string;
    email?: string;
  };
  attendeeCreated?: boolean;
  emailSent?: boolean;
}

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = await getTournamentBySlug(params.eventId);

  if (!tournament) {
    throw new Response("Tournament not found", { status: 404 });
  }

  const formData = Object.fromEntries(await request.formData());

  let registerData: SignUpData;
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

  const attendee = await getTournamentAttendee(
    tournament.slug,
    registerData.email
  );

  if (attendee) {
    return json<ActionData>(
      {
        errors: {
          email:
            "An attendee with that email has already registered for this event",
        },
      },
      { status: 400 }
    );
  }

  const user = await getUserByEmail(registerData.email);
  const approved = !!user?.roles && user.roles.length > 0;

  const verified = !!user && (await isVerified(user));
  await createAttendee({
    eventSlug: tournament.slug,
    name: registerData.name,
    email: registerData.email,
    approved,
    verified,
  });

  if (approved && !verified) {
    const accessKey = await getAttendeeKey(registerData.email, tournament.slug);

    await sendEmail(
      new VerifyAttendeeEmail(
        registerData.name,
        registerData.email,
        tournament.slug,
        tournament.title,
        accessKey
      )
    );
  } else if (!verified) {
    await sendEmail(
      new ProcessAttendeeRegistrationEmail(
        registerData.name,
        registerData.email,
        tournament.slug,
        tournament.title
      )
    );
  }

  return json<ActionData>({
    attendeeCreated: true,
    emailSent: !approved || !verified,
  });
};

export default function TournamentRegisterPage() {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  const { errors, attendeeCreated, emailSent } = (useActionData() ??
    {}) as ActionData;

  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  const user = useOptionalUser();

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.email) {
      emailRef.current?.focus();
    }
  }, [errors]);

  if (attendeeCreated === true) {
    return (
      <>
        <h2>
          <FiCheck /> Registration {emailSent ? "Received" : "Requested"}
        </h2>
        <p className="lead">
          Thanks, your registration for {tournament.title} has been received.
        </p>

        {emailSent && (
          <>
            <h3>What happens now?</h3>
            <p>
              You will receive an email that will let you verify your address.
              If you haven't received an email within a couple of days, please
              contact{" "}
              <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a>.
            </p>
          </>
        )}
        <h3>Payment</h3>
        <p>
          Tickets are priced at £15,{" "}
          <a href="https://www.paypal.com/paypalme/KamiOfTea/15">
            payable via PayPal
          </a>
          .
        </p>
        <p>
          If you’d prefer to pay using a different payment method, please
          contact <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a>
          .
        </p>
        <p>
          Tickets can be cancelled for a full refund until Thursday 30th March.
          After this, we will offer a refund if we can fill your place.
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
        <h2>Register for {tournament.title}</h2>
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
            defaultValue={user?.name}
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
            defaultValue={user?.email}
            aria-invalid={errors?.email ? true : undefined}
            aria-describedby="email-error"
          />
          {errors?.email && (
            <span className="form-error is-visible" id="email-error">
              {errors.email}
            </span>
          )}
        </label>
        <p>
          All attendees are expected to follow our{" "}
          <Link to="/code-of-conduct">Code of Conduct</Link>
        </p>
        <p>
          Any information you provide to us is protected by our{" "}
          <Link to="/privacy-policy">Privacy Policy</Link>
        </p>
        <input type="submit" className="button primary" value="Register" />
        <p>
          Already registered?{" "}
          <Link to={`/event/${tournament.slug}/edit-attendee`}>
            Update your details.
          </Link>
        </p>
        Don't want to sign up?{" "}
        <Link to={`/event/${tournament.slug}`}>
          Return to {tournament.title} event page.
        </Link>
      </Form>
    </>
  );
}
