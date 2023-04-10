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
  useRouteLoaderData,
} from "@remix-run/react";
import { getAttendeeKey, getResetKey } from "~/account/auth.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import invariant from "tiny-invariant";
import type { Attendee } from "~/tournament/attendee-model.server";
import { putAttendee } from "~/tournament/attendee-model.server";
import {
  createUser,
  getUserByEmail,
  putUser,
} from "~/account/user-model.server";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { redirect } from "@remix-run/router";
import { getSessionAttendee, getUser } from "~/account/session.server";
import * as yup from "yup";
import type { SchemaOf } from "yup";
import { ValidationError } from "yup";
import { getYupErrorMessage } from "~/utils/validation";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import type { User } from "~/account/user-model";
import { Role } from "~/account/user-model";
import { TournamentLoaderData } from "~/routes/event/$eventId";
import { additionalFieldTypes } from "~/tournament/additional-fields";

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

  const attendee = await getSessionAttendee(request, tournament.slug);

  if (!attendee) {
    return redirect(`/event/${params.eventId}/send-edit-link`);
  }

  const user = await getUser(request);

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
  const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

  invariant(params.eventId, "From route");
  const tournament = getTournamentBySlug(params.eventId);
  if (!tournament) {
    throw new Response("Event not found", { status: 404 });
  }

  const attendee = await getSessionAttendee(request, tournament?.slug);

  if (!attendee) {
    return redirect(`/event/${params.eventId}/send-edit-link`);
  }

  const formData = Object.fromEntries(await request.formData());

  if (formData.hasOwnProperty("setupAccount")) {
    let user = await getUserByEmail(attendee.email);
    if (!user) {
      user = await createUser(attendee.name, attendee.email, false);
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
  const additionalFields: Record<string, string> = {};
  Object.values(tournament?.additionalFields ?? {})
    .filter((field) => !field.readonly)
    .forEach(({ name }) => {
      const formDatum = formData[name];
      additionalFields[name] = typeof formDatum === "string" ? formDatum : "";
    });
  attendee.additionalFields = {
    ...(attendee.additionalFields ?? {}),
    ...additionalFields,
  };

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
  const { tournament } = useRouteLoaderData(
    "routes/event/$eventId"
  ) as TournamentLoaderData;

  const nameRef = React.useRef<HTMLInputElement>(null);

  const { attendee, user } = useLoaderData<LoaderData>();
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
        {(tournament.additionalFields ?? []).map((spec) => (
          <fieldset key={spec.name}>
            <label htmlFor={spec.name}>{spec.label}</label>
            {additionalFieldTypes[spec.type].input(
              spec.name,
              attendee?.additionalFields?.[spec.name] ?? "",
              attendee.eventSlug,
              attendee.slug
            )}
          </fieldset>
        ))}
        <input type="submit" className="button primary" value="Update" />
      </Form>
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
          <form method="post">
            <p>
              If you would like to login to edit your attendee details in
              future,{" "}
              <button
                type="submit"
                name="setupAccount"
                className="button clear link display-inline"
              >
                you can setup a password.
              </button>
              Otherwise you can request another one-time link if you need to
              update them later.
            </p>
          </form>
        </>
      )}
      <p>
        <Link to="../">Back to event page.</Link>
      </p>
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
