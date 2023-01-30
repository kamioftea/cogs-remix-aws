import { RouteMatch, useMatches } from "@remix-run/react";

export const CURRENT = Symbol("CURRENT");

export interface Breadcrumb {
  label: string | ((match: RouteMatch) => string);
  url?: string | typeof CURRENT;
}

function getLabel(label: Breadcrumb["label"], match: RouteMatch): string {
  const resolved = typeof label === "function" ? label(match) : label;
  return resolved.toLocaleUpperCase();
}

export function Breadcrumbs() {
  const matches = useMatches();

  const breadcrumbMatches: { breadcrumb: Breadcrumb; match: RouteMatch }[] =
    matches.flatMap(
      (match) =>
        match.handle?.breadcrumbs.map((breadcrumb: Breadcrumb) => ({
          breadcrumb,
          match,
        })) ?? []
    );
  const last = breadcrumbMatches.slice(-1)[0];
  const rest = breadcrumbMatches.slice(0, -1);

  const breadcrumbLinks = rest.map(({ breadcrumb, match }, index) => {
    const label = getLabel(breadcrumb.label, match);
    const url = breadcrumb.url === CURRENT ? match.pathname : breadcrumb.url;

    return <li key={index}>{url ? <a href={url}>{label}</a> : label}</li>;
  });

  const breadcrumbElements = [
    ...breadcrumbLinks,
    ...(last
      ? [
          <li key="current">
            <span className="show-for-sr">Current: </span>{" "}
            {getLabel(last.breadcrumb.label, last.match)}
          </li>,
        ]
      : []),
  ];

  return (
    <nav aria-label="You are here:" role="navigation">
      <ul className="breadcrumbs">{...breadcrumbElements}</ul>
    </nav>
  );
}
