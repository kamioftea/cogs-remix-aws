import type { ReactNode } from "react";
import { Link } from "@remix-run/react";

export interface ErrorPageProps {
  heading: string;
  children: ReactNode;
}

export default function ErrorPage({ heading, children }: ErrorPageProps) {
  return (
    <main>
      <h1>{heading}</h1>
      {children}
      <p>
        <Link to="/">Return to Kings of War homepage.</Link>
      </p>
    </main>
  );
}

export const GenericErrorPage = () => (
  <ErrorPage heading={"An unexpected error occurred"}>
    <p>
      There was a problem processing your request. Usually this will be
      temporary, so please try again.
    </p>
    <p>
      If you keep seeing this message, please{" "}
      <a href="mailto:contact@jeff-horton.uk">email contact@jeff-horton.uk</a>{" "}
      and let me know what you are trying to do. Please include a copy of the
      URL and any other details you think might be relevant.
    </p>
  </ErrorPage>
);
