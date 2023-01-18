import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

import stylesheetUrl from "./styles/globals.css";
import { getUser } from "./session.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import type { PropsWithChildren } from "react";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheetUrl },
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Kings of War | Chesterfield Open Gaming Society",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

function LayoutBoilerplate({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <LayoutBoilerplate>
      <Outlet />
    </LayoutBoilerplate>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <LayoutBoilerplate>
      <GenericErrorPage />
    </LayoutBoilerplate>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <LayoutBoilerplate>
        <ErrorPage heading="Page not found">
          <p>Sorry the requested URL is not a page on this site.</p>
        </ErrorPage>
      </LayoutBoilerplate>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
