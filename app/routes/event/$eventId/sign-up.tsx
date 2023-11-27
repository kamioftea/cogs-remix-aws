import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import * as React from "react";
import { useEffect } from "react";
import type { ObjectSchema } from "yup";
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
  listTournamentAttendeesByEventSlug,
} from "~/tournament/attendee-model.server";
import { sendEmail } from "~/utils/send-email.server";
import { VerifyAttendeeEmail } from "~/tournament/verify-attendee-email";
import { getAttendeeKey } from "~/account/auth.server";
import { ProcessAttendeeRegistrationEmail } from "~/tournament/process-attendee-registration-email";
import type { TournamentLoaderData } from "~/routes/event/$eventId";
import { useOptionalUser } from "~/utils";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import { getUser } from "~/account/session.server";
import { redirect } from "@remix-run/router";

interface SignUpData {
  name: string;
  email: string;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = getTournamentBySlug(params.eventId);
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

const schema: ObjectSchema<SignUpData> = yup.object().shape({
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
  isWaitList?: boolean;
}

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, "eventId not found");

  const tournament = getTournamentBySlug(params.eventId);

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

  const attendees = await listTournamentAttendeesByEventSlug(tournament.slug);
  const isWaitList =
    tournament.maxAttendees != null &&
    (attendees.findIndex((a) => a.email === registerData.email) ??
      tournament.maxAttendees) >= tournament.maxAttendees;
  let emailSent = false;

  if (!isWaitList && approved && !verified) {
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

    emailSent = true;
  } else if (!verified) {
    await sendEmail(
      new ProcessAttendeeRegistrationEmail(
        registerData.name,
        registerData.email,
        tournament.slug,
        tournament.title
      )
    );

    emailSent = true;
  }

  return json<ActionData>({
    attendeeCreated: true,
    emailSent,
    isWaitList,
  });
};

export default function TournamentRegisterPage() {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  const { errors, attendeeCreated, emailSent, isWaitList } = (useActionData() ??
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

  if (attendeeCreated && isWaitList) {
    return (
      <>
        <h2>You have been added to the wait list</h2>
        <p>
          Unfortunately we've reached the maximum number of players we can
          comfortably fit in the venue.
        </p>
        <p>
          Your name has been added to our wait list and we'll be in touch if
          anyone drops out.
        </p>
        <p>
          <Link to={`/event/${tournament.slug}`}>
            Return to {tournament.title} event page.
          </Link>
        </p>
      </>
    );
  }

  if (attendeeCreated === true) {
    return (
      <>
        <h2>
          <FiCheck /> Registration {emailSent ? "Received" : "Requested"}
        </h2>
        <p className="lead">
          Thanks, your registration for {tournament.title} has been received.
        </p>
        {isWaitList && (
          <>
            <p>
              Unfortunately we've reached the maximum number of players we can
              comfortably fit in the venue.
            </p>
            <p>
              Your name has been added to our wait list and we'll be in touch if
              anyone drops out.
            </p>
          </>
        )}
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
        {!isWaitList && (tournament.costInPounds ?? 0) > 0 && (
          <>
            <h3>Payment</h3>
            <p>
              Tickets are priced at £{tournament.costInPounds}
              {tournament.payPalLink && (
                <>
                  , <a href={tournament.payPalLink}>payable via PayPal</a>
                </>
              )}
              .
            </p>
            <p>
              If you’d prefer to pay using a different payment method, please
              contact{" "}
              <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a>.
            </p>
            <p>
              Tickets can be cancelled for a full refund until Thursday 30th
              March. After this, we will offer a refund if we can fill your
              place.
            </p>
          </>
        )}
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
          <Link to={`/event/${tournament.slug}/edit-details`}>
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
