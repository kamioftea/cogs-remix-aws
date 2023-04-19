import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/account/user-model";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function sortBy<T>(
  ...lenses: ((t: T) => number | string)[]
): (a: T, b: T) => number {
  return (a: T, b: T) => {
    for (const lens of lenses) {
      const resA = lens(a);
      const resB = lens(b);
      if (resA === resB) {
        continue;
      }

      if (typeof resA === "number" && typeof resB === "number") {
        return resA - resB;
      }
      if (typeof resA === "string" && typeof resB === "string") {
        return resA.localeCompare(resB);
      }

      throw new Error("Lens must return a consistent type");
    }

    return 0;
  };
}

export function toPairs<T>(arr: T[]): [T, T][] {
  const chunks: [T, T][] = [];
  function iter([a, b, ...rest]: T[]): void {
    chunks.push([a, b]);
    if (rest.length > 0) {
      iter(rest);
    }
  }

  iter(arr);

  return chunks;
}
