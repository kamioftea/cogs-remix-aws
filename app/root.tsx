import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";

import stylesheetUrl from "./styles/globals.css";
import { getSessionEmail, getUser } from "./account/session.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import type { PropsWithChildren } from "react";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import type { User } from "~/account/user-model";
import { Role } from "~/account/user-model";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheetUrl },
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
  ];
};

export const meta: MetaFunction<LoaderData> = ({ location, data }) => ({
  charset: "utf-8",
  title: "Kings of War | Chesterfield Open Gaming Society",
  viewport: "width=device-width,initial-scale=1",
  "og:type": "website",
  "og:title": "Kings of War | Chesterfield Open Gaming Society",
  "og:url": data?.base_url + location.pathname,
  "og:image": data?.base_url + "/_static/images/cogs-og-image.png",
  "og:image:type": "image/png",
  "og:image:alt": "Chesterfield Open Gaming Society logo",
});

const breadcrumbs: Breadcrumb[] = [
  { label: "Home", url: "https://www.c-o-g-s.org.uk" },
  { label: "Kings of War", url: CURRENT },
];

export const handle = {
  breadcrumbs,
};

type LoaderData = {
  email: Awaited<ReturnType<typeof getSessionEmail>>;
  user: Awaited<ReturnType<typeof getUser>>;
  base_url: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    email: await getSessionEmail(request),
    user: await getUser(request),
    base_url: process.env.BASE_URL || "http://localhost:3000",
  });
};

interface BoilerplateProps extends PropsWithChildren {
  user?: User | "NO_HEADER";
  email?: string;
}

function LayoutBoilerplate({ user, email, children }: BoilerplateProps) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {user !== "NO_HEADER" && (
          <header className="text-right">
            {user && (
              <>
                Logged in as {user.name} <Link to="/account">Account</Link> |{" "}
                <form
                  action="/account/logout"
                  method="post"
                  className="display-inline"
                >
                  <button
                    type="submit"
                    className="button clear link display-inline"
                  >
                    Logout
                  </button>
                </form>
                {user.roles?.includes(Role.Admin) && (
                  <>
                    {" "}
                    | <Link to={"/admin"}>Admin</Link>
                  </>
                )}
              </>
            )}
            {!user && email && (
              <>
                Logged in as attendee, email: {email}.{" "}
                <form
                  action="/account/logout"
                  method="post"
                  className="display-inline"
                >
                  <button
                    type="submit"
                    className="button clear link display-inline"
                  >
                    Logout
                  </button>
                </form>
              </>
            )}
            {!user && !email && (
              <>
                Not logged in <Link to="/account/register">Sign Up</Link> |{" "}
                <Link to="/account/login">Login</Link>
              </>
            )}
          </header>
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const { user, email } = useLoaderData<typeof loader>() ?? ({} as LoaderData);

  return (
    <LayoutBoilerplate user={user} email={email}>
      <Outlet />
    </LayoutBoilerplate>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <LayoutBoilerplate user={"NO_HEADER"}>
      <GenericErrorPage />
    </LayoutBoilerplate>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <LayoutBoilerplate user={"NO_HEADER"}>
        <ErrorPage heading="Page not found">
          <p>Sorry the requested URL is not a page on this site.</p>
        </ErrorPage>
      </LayoutBoilerplate>
    );
  }

  if (caught.status === 403) {
    return (
      <LayoutBoilerplate user={"NO_HEADER"}>
        <ErrorPage heading="Not authorised">
          <p>
            The account you're logged in as does not have permission to access
            this page.
          </p>
        </ErrorPage>
      </LayoutBoilerplate>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
