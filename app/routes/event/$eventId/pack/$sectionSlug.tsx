import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { PackSection } from "~/tournament/tournament-model.server";
import { getTournamentBySlug } from "~/tournament/tournament-model.server";
import { json } from "@remix-run/router";
import { useLoaderData } from "@remix-run/react";
import { slugify } from "~/utils/slugify";
import { useEffect, useRef } from "react";
import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";

export interface PackSectionLoaderData {
  section: PackSection;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.eventId, "eventId not found");
  invariant(params.sectionSlug, "sectionSlug not found");

  const tournament = await getTournamentBySlug(params.eventId);
  if (!tournament || !tournament.eventPack) {
    throw new Response("No online rules pack for this event", { status: 404 });
  }

  const section = tournament.eventPack.find(
    (section) => section.slug ?? slugify(section.title) === params.sectionSlug
  );

  if (!section) {
    throw new Response("No rules pack section matches the URL", {
      status: 404,
    });
  }

  return json<PackSectionLoaderData>(
    { section },
    {
      headers: {
        "Cache-Control": `max-age=${60 * 60 * 24}`,
      },
    }
  );
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: ({ data }) => {
      const { section } = data as PackSectionLoaderData;
      return section.title;
    },
    url: CURRENT,
  },
];

export const handle = { breadcrumbs };

export default function EventPackLandingPage() {
  const { section } = useLoaderData<PackSectionLoaderData>();

  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.scrollIntoView({ behavior: "smooth" });
    titleRef.current?.focus();
  }, [section.title]);

  return (
    <>
      <h2 ref={titleRef} key={section.slug ?? slugify(section.title)}>
        {section.title}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: section.content }} />
    </>
  );
}
