import { renderMarkdownInline, unsafeRenderMarkdown } from "~/utils/markdown";

export interface Tournament {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  about?: Record<string, string[]>;
  content: string;
  disclaimer?: string;
  imageUrl: string;
  imageDescription: string;
  titlePosition?: string;
  openGraph: Partial<OpenGraphMeta>;
}

export interface OpenGraphMeta {
  imageUrl: string;
}

export const tournaments: Tournament[] = [
  {
    title: "Cogs of War",
    subtitle: "A Kings of War Tournament",
    slug: "cogs-of-war",
    titlePosition: "min(4.25rem, 8vw)",
    imageUrl: "cogs-of-war.png",
    imageDescription: `An army of abyssal dwarves besieges an icy fortress defended by fur-clad humans. Most of the 
                       image is in greyscale, but the elf force is monochrome yellow.`,
    openGraph: {
      imageUrl: "https://kow.c-o-g-s.org.uk/_static/images/cogs-of-war-og.png",
    },
    description: `A one-day Kings of War singles tournament using the 3.5 edition rules.`,
    about: {
      What: ["20 players, 1995 points, 3 games"],
      When: ["23rd April 2023, 9:45 until 17:30"],
      Where: [
        "The Parish Centre",
        "Stonegravels",
        "91 Sheffield Road",
        "Chesterfield",
        "S41 7JH",
      ],
    },
    content: unsafeRenderMarkdown(`
## Save the date

<p class="lead">
  Announcing Cogs of War. A 1995 points, one day Kings of War singles tournament using the 3.5 edition rules.
</p>

The full rules pack and sign-up will be available at the start of December.`),
    disclaimer: renderMarkdownInline(
      `Mantic® and Kings of War® and all associated names, characters, places, and things are copyright © and
      ™ Mantic Games. The event image is [The Siege of Chill](https://www.manticgames.com/wallpapers/) © 
      Mantic Games. Chesterfield Open Gaming Society is not associated with Mantic Games in any way.`
    ),
  },
  {
    title: "Twilight Expansion",
    subtitle: "A Kings of War escalation campaign",
    slug: "twilight-expansion",
    titlePosition: "min(12.75rem, 25vw)",
    imageUrl: "escalation.png",
    imageDescription: `A mighty army of skeleton warriors marches against a small force of elves. Most of the image is 
                       in greyscale, but the elf force is monochrome yellow.`,
    openGraph: {
      imageUrl:
        "https://kow.c-o-g-s.org.uk/_static/images/twilight-expansion-og.png",
    },
    content: unsafeRenderMarkdown(`
## Prepare for battle

<p class="lead">
  Announcing Twilight Expansion. A six-month-long escalation campaign using the Kings of War 3.5 edition rules.
</p>

The campaign will be played on the <abbr title="Chesterfield Open Gaming Society">COGS</abbr> club nights. We will start
with a 500 point Ambush! game in January growing to 2300 points in June. Players will be encouraged to record the 
narrative of their campaign force as the campaign unfolds.

The full rules pack and sign-up will be available soon.    
    `),
    description: `A one-day Kings of War singles tournament using the 3.5 edition rules.`,
    about: {
      Points: ["500 to 2300"],
      When: [
        "Starting February 2023",
        "19:00 - 22:00 Mondays, or 2nd and 4th Wednesdays",
      ],
      Where: [
        "The Parish Centre",
        "Stonegravels",
        "91 Sheffield Road",
        "Chesterfield",
        "S41 7JH",
      ],
    },
    disclaimer: renderMarkdownInline(
      `Mantic® and Kings of War® and all associated names, characters, places, and things are copyright © and
       ™ Mantic Games. The event image is [The Battle of Borath Lei](https://www.manticgames.com/wallpapers/) ©
       Mantic Games. Chesterfield Open Gaming Society is not associated with Mantic Games in any way. `
    ),
  },
];

const tournamentsBySlug = Object.fromEntries(
  tournaments.map((e) => [e.slug, e])
);

export function getTournamentBySlug(slug: string): Tournament | undefined {
  return tournamentsBySlug[slug];
}
