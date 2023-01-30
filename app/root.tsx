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
import { getUser } from "./account/session.server";
import ErrorPage, { GenericErrorPage } from "~/error-handling/error-page";
import type { PropsWithChildren } from "react";
import { Breadcrumb, CURRENT } from "~/utils/breadcrumbs";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheetUrl },
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
  ];
};

export const meta: MetaFunction = ({ location, data }) => ({
  charset: "utf-8",
  title: "Kings of War | Chesterfield Open Gaming Society",
  viewport: "width=device-width,initial-scale=1",
  "og:type": "website",
  "og:title": "Kings of War | Chesterfield Open Gaming Society",
  "og:url": data.root_url + location.pathname,
  "og:image": data.root_url + "/_static/images/cogs-og-image.png",
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
  user: Awaited<ReturnType<typeof getUser>>;
  root_url: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
    root_url: process.env.ROOT_URL || "http://localhost:3000",
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
