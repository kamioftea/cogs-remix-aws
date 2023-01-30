import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import * as React from "react";
import { useEffect } from "react";
import {
  Form,
  Link,
  useActionData,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import {
  getAttendeeKey,
  getResetKey,
  validateAttendeeKey,
} from "~/account/auth.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import invariant from "tiny-invariant";
import {
  Attendee,
  getTournamentAttendee,
  putAttendee,
} from "~/tournament/attendee-model.server";
import {
  createUser,
  getUserByEmail,
  putUser,
  Role,
  User,
} from "~/account/user-model.server";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { redirect } from "@remix-run/router";
import { getUser } from "~/account/session.server";
import * as yup from "yup";
import { SchemaOf, ValidationError } from "yup";
import { getYupErrorMessage } from "~/utils/validation";
import { Breadcrumb, CURRENT } from "~/utils/breadcrumbs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

interface LoaderData {
  attendee: Attendee;
  user: User | null;
}

const breadcrumbs: Breadcrumb[] = [{ label: "Edit Details", url: CURRENT }];

export const handle = { breadcrumbs };

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  const tournament = getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  let attendee: Attendee | null;
  let user: User | null;

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token) {
    attendee = await validateAttendeeKey(request, tournament.slug);
    user = await getUserByEmail(attendee.email);
  } else {
    user = await getUser(request);
    if (!user) {
      return redirect(`/event/${tournament.slug}/send-edit-link`);
    }
    attendee = await getTournamentAttendee(tournament.slug, user.email);
    if (!attendee) {
      return redirect(`/event/${tournament.slug}/sign-up`);
    }
  }

  console.log({ attendee, user });
  return json<LoaderData>({ attendee, user });
};

interface EditDetailsData {
  name: string;
}

const schema: SchemaOf<EditDetailsData> = yup.object().shape({
  name: yup.string().required(),
});

interface ActionData {
  errors?: {
    name?: string;
  };
}

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, "From route");
  console.log("action?");
  const attendee = await validateAttendeeKey(request, params.eventId);

  const formData = Object.fromEntries(await request.formData());

  if (formData.hasOwnProperty("setupAccount")) {
    let user = await getUserByEmail(attendee.email);
    if (!user) {
      user = await createUser(attendee.name, attendee.email);
    }

    if (!user.roles || user.roles.length === 0) {
      user.roles = [Role.Registered];
      await putUser(user);
    }

    const urlBuilder = new URL(`${BASE_URL}/account/verify/`);
    urlBuilder.searchParams.set("token", await getResetKey(user.email));
    return redirect(urlBuilder.toString());
  }

  let data: EditDetailsData;
  try {
    data = await schema.validate(formData, { abortEarly: false });
  } catch (err) {
    if (ValidationError.isError(err)) {
      return json<ActionData>(
        {
          errors: {
            name: getYupErrorMessage("name", err),
          },
        },
        400
      );
    }
    throw err;
  }

  attendee.name = data.name;
  await putAttendee(attendee);

  const urlBuilder = new URL(
    `${BASE_URL}/event/${params.eventId}/edit-details`
  );
  urlBuilder.searchParams.set(
    "token",
    await getAttendeeKey(attendee.email, params.eventId)
  );
  return redirect(urlBuilder.toString());
};

export default function EditAttendeePage() {
  console.log("EditAttendeePage");

  const nameRef = React.useRef<HTMLInputElement>(null);

  const { attendee, user } = useLoaderData<typeof loader>();
  const { errors } = (useActionData() ?? {}) as ActionData;

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    }
  }, [errors]);

  return (
    <>
      <p className="lead">
        Attendee details for {attendee.name} &lt;{attendee.email}&gt;.
      </p>
      <Form method="post" className="">
        <h2>Update details</h2>
        <label className={errors?.name ? "is-invalid-label" : undefined}>
          Name
          <input
            ref={nameRef}
            id="name"
            required
            autoFocus={true}
            name="name"
            type="text"
            defaultValue={attendee.name}
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
        <input type="submit" className="button primary" value="Update" />
        {user ? (
          <p>
            <FiCheckCircle className="text-success" /> Linked to account.{" "}
            <Link to={"/account"}>View linked account</Link>
          </p>
        ) : (
          <>
            <p>
              <FiAlertCircle className="text-alert" /> Not linked to an account
            </p>
            <p>
              If you would like to login to edit your attendee details in
              future,{" "}
              <form method="post" className="display-inline">
                <button
                  type="submit"
                  name="setupAccount"
                  className="button clear link display-inline"
                >
                  you can setup a password
                </button>
              </form>
              . Otherwise you can request another one-time link if you need to
              update them later.
            </p>
          </>
        )}
        <p>
          <Link to="../">Back to event page.</Link>
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

  console.error({ caught });
  return <GenericErrorPage />;
}
