import { renderMarkdownInline, unsafeRenderMarkdown } from "~/utils/markdown";

export interface PackSection {
  title: string;
  slug?: string;
  content: string;
}

export interface Tournament {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  about?: Record<string, string[]>;
  content?: string;
  signUpEnabled: boolean;
  disclaimer?: string;
  imageUrl: string;
  imageDescription: string;
  titlePosition?: string;
  openGraph: Partial<OpenGraphMeta>;
  rulesPack?: PackSection[];
  rulesPdfUrl?: {
    base: string;
    name: string;
  };
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
    signUpEnabled: true,
    disclaimer: renderMarkdownInline(
      `Mantic® and Kings of War® and all associated names, characters, places, and things are copyright © and
      ™ Mantic Games. The event image is [The Siege of Chill](https://www.manticgames.com/wallpapers/) © 
      Mantic Games. Chesterfield Open Gaming Society is not associated with Mantic Games in any way.`
    ),
    rulesPack: [
      {
        title: "Tournament organiser",
        content: unsafeRenderMarkdown(`
The tournament organiser for this event is Jeff Horton. If you have 
questions or feedback, please email Jeff at 
[jeff@goblinoid.co.uk](mailto:jeff@goblinoid.co.uk).`),
      },
      {
        title: "Tickets",
        content: unsafeRenderMarkdown(`
To sign up for this event, please [fill in the sign-up form](
https://kow.c-o-g-s.org.uk/event/cogs-of-war/sign-up).

Tickets are priced at £15, [payable via PayPal](
https://www.paypal.com/paypalme/KamiOfTea/15).

If you’d prefer to pay using a different payment method, please contact 
the tournament organiser.

Tickets can be cancelled for a full refund until Thursday 30th March. 
After this, we will offer a refund if we can fill your place.`),
      },
      {
        title: "Inclusivity and accessibility",
        content: unsafeRenderMarkdown(`
Chesterfield Open Gaming Society is dedicated to providing an inclusive, 
harassment-free gaming experience for everyone. Attendees should feel 
safe and welcome regardless of gender, gender identity and expression, 
age, sexual orientation, disability, physical appearance, body size, 
race, ethnicity, religion (or lack thereof), or hobby choices.

If there is anything that we can do to make it easier or more enjoyable 
for you to attend, please let us know.

We can’t do this by ourselves. Creating a welcoming, enjoyable, and safe
environment is everyone’s responsibility. In particular we will not 
tolerate harassment at the event, during related socials, or on 
associated social media.

Please read the [full code of conduct](
https://kow.c-o-g-s.org.uk/code-of-conduct) for more details.

Thank you.`),
      },
      {
        title: "Preparation",
        content: unsafeRenderMarkdown(`
You will need a 1995 point Kings of War army. This should be built using
the standard army selection and composition rules in the 3.5 edition 
core rulebook. 

The optional rules for Allies **CAN** be used.

You will be able to submit your list on the event website. Alternatively
[email a pdf of your list to jeff@goblinoid.co.uk](
mailto:jeff@goblinoid.co.uk). Your list should be submitted by 23:59 on 
Sunday 16th March. 

Players will receive +3 tournament points if they submit on time. This 
will reduce by one point per day or part-day since the submission time 
that has passed before the list is received.

Part of the joy of wargaming is the spectacle of two armies clashing on the
table-top. Please bring a fully painted and based army that fits with 
the fantasy wargaming aesthetic. However we will not penalise players if
they have a good reason they can’t – no questions asked.

It should be clear to your opponent what each unit in your army 
represents.`),
      },
      {
        title: "Things to bring with you",
        content: unsafeRenderMarkdown(`
- Your 1995 point army.
- Three copies of your list.
- A copy of the  3.5 edition Kings of War core rulebook.
- Dice, tape measure, arc template, and tokens.
- A chess clock (physical or app)`),
      },
      {
        title: "Location",
        content: unsafeRenderMarkdown(`
The event will be held at the same venue used for COGS club evenings.

The Parish Centre<br />
Stonegravels<br />
91 Sheffield Road<br />
Chesterfield<br />
S41 7JH

There is car parking on site. A few spaces are stacked behind others. 
Please make sure to fill the rear spaces first. There should be enough 
parking at the centre for everyone, but it will be close to full
capacity, so please contact us if you need to reserve a space for 
accessibility needs or a quick get-away.
 
There is a bus stop just outside the venue. If you are coming by train, 
please get in contact as we should be able to arrange a lift to the 
centre from Chesterfield station.`),
      },
      {
        title: "Food and drink",
        content: unsafeRenderMarkdown(`
Free tea and coffee will be available.

Lunch will **NOT** be provided.

There are a number of takeaways and supermarkets within walking 
distance. We will endeavour to provide a list and menus on the event 
website nearer the time.

A selection of soft drinks and snacks will be available to purchase 
during the event.`),
      },
      {
        title: "Schedule",
        content: unsafeRenderMarkdown(`
Each round players will have 55 minutes each on their chess clocks, 
plus ten minutes spare for introductions, pre-game admin, breaks, rules 
queries, etc.

|              | Start Time |
| ------------ | ---------- |
| Registration |  9:45      |
| Briefing     | 10:00      |
| Game one     | 10:15      |
| Lunch        | 12:15      |
| Game two     | 13:00      |
| Break        | 15:00      |
| Game three   | 15:15      |
| Awards       | 17:15      |
| Close        | 17:30      |

The schedule may need to be adjusted on the day.`),
      },
      {
        title: "Playing the games",
        content: unsafeRenderMarkdown(`
The event will be using the rules in the 3.5 edition core rulebook, 
along with any FAQ or errata published by Mantic Games prior to the 
event.

The optional withdraw rule will NOT be in play.

Chess clocks will be used to help the tournament run on schedule. Clocks
should be used throughout deployment, scout moves, and player turns.
 
If you and your opponent disagree on a rule, pause the clock whilst you 
check the rulebook. If that doesn’t resolve your issue, please ask the 
tournament organiser to adjudicate.

The clock should also be paused if either player needs to take a break 
for any reason.

If a player times out whilst resolving an attack, they may finish 
resolving that attack, and any pending nerve checks. After those are 
done, the timed out player may not roll any more dice and can only issue
change facing orders during any remaining movement phases. Please ensure 
to complete these moves quickly.

If there are enough pauses during a game that you predict the round time
will end before both players have finished, please inform the tournament 
organiser as soon as possible so that this can be resolved fairly for 
both players.`),
      },
      {
        title: "Scenarios and scoring",
        content: unsafeRenderMarkdown(`
We will be using scenarios based on the [balanced scenarios developed by 
the Shroud of the Reaper tournament organisers](
https://www.shroudofthereaper.co.uk/balanced-scenarios).
        
There will be one scenario based on controlling objective markers, one 
based on holding loot tokens, and one based on controlling areas of the 
battlefield.

Full details of the scenario to be played and how to score victory 
points will be provided at the start of each round.

There will be up to 7 victory points available for each scenario, with 
at most 3 points scored if you draw or lose. These will also count as 
tournament points (TPs).

You get 3 bonus tournament points if you win the scenario, 1 bonus point
if you draw.

You get up to three bonus tournament points based on the total points of
enemy units you routed during the game.
 
| Total points routed | Bonus TPs |
| ------------------- | --------- |
|  500+               | +1        |
| 1100+               | +2        |
| 1695+               | +3        |

Players will therefore score up to thirteen tournament points per round. 
With three list submission points, the maximum available tournament 
score is 42.`),
      },
      {
        title: "Awards",
        content: unsafeRenderMarkdown(`
Trophies will be awarded for first, second, and third places. There will 
be a wooden spoon for last place.

Players will be able to cast votes for their favourite armies. The 
army with the most votes will win the best army award, with the 
tournament organiser having a deciding vote in the case of a tie. Please 
leave your army on display over lunch so that everyone has a chance to 
decide who to vote for.

Players will be able to cast votes for their most sporting opponent when 
they submit their final scores. The player with the most votes will win the 
most sporting award. Ties will be broken in the favour of the player 
with the lower ranking in the tournament scores.

For both categories, players will receive seven total votes they can
distribute as they see fit, including casting multiple votes for one or 
more candidates.`),
      },
    ],
    rulesPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "cogs-of-war-tournament-pack.pdf",
    },
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
    signUpEnabled: false,
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
