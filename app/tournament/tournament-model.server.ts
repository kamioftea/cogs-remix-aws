import arc from "@architect/functions";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { merge, unset } from "lodash";

import { renderMarkdownInline, unsafeRenderMarkdown } from "~/utils/markdown";
import type { AdditionalFieldType } from "~/tournament/additional-fields";
import type { Scenario } from "~/tournament/scenario/scenario";
import { Loot } from "~/tournament/scenario/loot";
import { FoolsGold } from "~/tournament/scenario/fools-gold";
import { Invade } from "~/tournament/scenario/invade";
import { Plunder } from "~/tournament/scenario/plunder";
import { Control } from "~/tournament/scenario/control";
import { Pillage } from "~/tournament/scenario/pillage";
import { CompassPoints } from "~/tournament/scenario/compass-points";
import { GoldRush } from "~/tournament/scenario/gold-rush";
import { SmallPillage } from "~/tournament/scenario/small/small-pillage";
import { SmallDominate } from "~/tournament/scenario/small/small-dominate";
import { SmallStockpile } from "~/tournament/scenario/small/small-stockpile";
import { SmallFoolsGold } from "~/tournament/scenario/small/small-fools-gold";
import { SmallControl } from "~/tournament/scenario/small/small-control";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface AdditionalFieldSpec {
  type: AdditionalFieldType;
  name: string;
  label: string;
  readonly?: boolean;
}

export interface PackSection {
  title: string;
  slug?: string;
  content: string;
}

export interface OrganiserPlayer {
  name: string;
  email: string;
  listPdfUrl?: {
    base: string;
    name: string;
  };
}

export interface Tournament {
  title: string;
  subtitle: string;
  slug: string;
  date?: Dayjs;
  description: string;
  about?: Record<string, string[]>;
  content?: string;
  signUpEnabled: boolean;
  disclaimer?: string;
  imageUrl: string;
  imageDescription: string;
  titlePositionX?: string;
  titleStyles?: Record<string, string>;
  openGraph: OpenGraphMeta;
  eventPack?: PackSection[];
  eventPackPdfUrl?: {
    base: string;
    name: string;
  };
  scenarioPdfUrl?: {
    base: string;
    name: string;
  };
  costInPounds?: number;
  payPalLink?: string;
  maxAttendees?: number;
  additionalFields?: AdditionalFieldSpec[];
  listsSubmissionClosed?: boolean;
  sparePlayer?: OrganiserPlayer;
  lowAttendeesPlayer?: OrganiserPlayer;
  scenarios: {
    scenario: Scenario;
    mapUrl: string;
    roundEnd?: string;
  }[];
  bonusPoints?: {
    win?: number;
    draw?: number;
    loss?: number;
  };
  pointsLimit?: number;
  kowMastersSeason: number;
  kowMastersEventId?: number;
  manticCompanionEventId?: number;
  bands?: [number, number][];
}

export interface OpenGraphMeta {
  imageUrl: string;
  imageType?: string;
  imageAlt: string;
}

export const tournaments: Tournament[] = [
  {
    title: "Cogs of War 2023",
    subtitle: "A Kings of War Tournament",
    slug: "cogs-of-war",
    titlePositionX: "min(4.25rem, 8vw)",
    date: dayjs("2023-04-23"),
    imageUrl: "cogs-of-war.png",
    imageDescription: `An army of abyssal dwarves besieges an icy fortress defended by fur-clad humans. Most of the 
                       image is in greyscale, but the elf force is monochrome yellow.`,
    openGraph: {
      imageUrl: "https://kow.c-o-g-s.org.uk/_static/images/cogs-of-war-og.png",
      imageAlt:
        "An army of abyssal dwarves besieges an icy fortress defended by fur-clad humans. Most of the image is in greyscale, but the elf force is monochrome yellow.",
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
    signUpEnabled: false,
    disclaimer: renderMarkdownInline(
      `Mantic® and Kings of War® and all associated names, characters, places, and things are copyright © and
      ™ Mantic Games. The event image is [The Siege of Chill](https://www.manticgames.com/wallpapers/) © 
      Mantic Games. Chesterfield Open Gaming Society is not associated with Mantic Games in any way.`,
    ),
    eventPack: [
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

You can submit your list on the <a href="/event/cogs-of-war/edit-details">
edit details page</a>. Alternatively 
[email a pdf of your list to jeff@goblinoid.co.uk](
mailto:jeff@goblinoid.co.uk). Your list should be submitted by 23:59 on 
Sunday 16th April.

Players will receive +3 tournament points if they submit on time. This 
will reduce by one point per day or part-day since the submission time 
that has passed before the list is received, to a minimum of 0 if it is three
or more days late.

Part of the joy of wargaming is the spectacle of two armies clashing on the
table-top. Please bring a fully painted and based army that fits with 
the fantasy wargaming aesthetic. However, we will not penalise players if
they have a good reason they can’t – no questions asked.

It should be clear to your opponent what each unit in your army 
represents.

Steve Pearson is our spare player. In the event that we have an odd number of 
attendees, he'll use this list.

<div class="uploaded-file">
  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
       stroke-linejoin="round" height="3em" width="3em" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
  <span class="file-name">Cogs of War - Spare Player.pdf</span>
  <a
    href="https://static.goblinoid.co.uk/Cogs_Spare_Player.pdf"
    download="Cogs_Spare_Player.pdf"
    target="_blank"
    class="button primary"
  >
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
         stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download
  </a>
</div>
`),
      },
      {
        title: "Things to bring with you",
        content: unsafeRenderMarkdown(`
- Your 1995 point army.
- Three copies of your list.
- A copy of the 3.5 edition Kings of War core rulebook.
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
    eventPackPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "cogs-of-war-tournament-pack.pdf",
    },
    scenarioPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "cogs-of-war-scenarios-and-scoring.pdf",
    },
    costInPounds: 15,
    payPalLink: "https://www.paypal.com/paypalme/KamiOfTea/15",
    maxAttendees: 20,
    additionalFields: [
      {
        name: "army_list",
        type: "ARMY_LIST",
        readonly: true,
        label: "Army list",
      },
      {
        name: "faction",
        type: "STRING",
        readonly: true,
        label: "Faction",
      },
      {
        name: "allies",
        type: "STRING",
        readonly: true,
        label: "Allies",
      },
      {
        name: "tournament_points",
        type: "SCORE",
        readonly: true,
        label: "Tournament points",
      },
      {
        name: "total_routed",
        type: "SCORE",
        readonly: true,
        label: "Total routed",
      },
      {
        name: "total_attrition",
        type: "SCORE",
        readonly: true,
        label: "Total attrition",
      },
      {
        name: "bonus_points",
        type: "SCORE",
        readonly: true,
        label: "Bonus points",
      },
      {
        name: "awards",
        type: "STRING",
        readonly: true,
        label: "Awards",
      },
    ],
    listsSubmissionClosed: true,
    scenarios: [
      {
        scenario: Loot,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Loot.png",
        roundEnd: "2023-04-23 12:15:00",
      },
      {
        scenario: FoolsGold,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/FoolsGold.png",
        roundEnd: "2023-04-23 15:05:00",
      },
      {
        scenario: Invade,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Invade.png",
        roundEnd: "2023-04-23 17:25:00",
      },
    ],
    pointsLimit: 1995,
    kowMastersEventId: 298,
    kowMastersSeason: 8,
  },
  {
    title: "Cogs of War 2024",
    subtitle: "A Kings of War Tournament",
    slug: "cogs-of-war-2024",
    titlePositionX: "min(12.75rem, 25vw)",
    date: dayjs("2024-04-14"),
    imageUrl: "cogs-of-war-2024.png",
    imageDescription:
      "A mighty army of skeleton warriors marches against a " +
      "small force of elves. Most of the image is in greyscale, but the elf " +
      "force is monochrome yellow.",
    openGraph: {
      imageUrl:
        "https://kow.c-o-g-s.org.uk/_static/images/cogs-of-war-2024-og.png",
      imageAlt:
        "A mighty army of skeleton warriors marches against a small force of elves. " +
        "Most of the image is in greyscale, but the elf force is monochrome yellow. " +
        'Superimposed on top of this is the COGS logo and the text "Chesterfield ' +
        "Open Gaming Society Presents Cogs of War 2024, A Kings of War Tournament, " +
        '14th April 2024"',
    },
    description: `A one-day Kings of War singles tournament using the 3.5 edition rules and the 
    Clash of Kings 2024 updates.`,
    about: {
      What: ["20 players, 1995 points, 3 games"],
      When: ["14th April 2024, 10:00 until 17:45"],
      Where: [
        "The Parish Centre",
        "Stonegravels",
        "91 Sheffield Road",
        "Chesterfield",
        "S41 7JH",
      ],
    },
    signUpEnabled: false,
    disclaimer: renderMarkdownInline(
      `Mantic® and Kings of War® and all associated names, characters, places, and things
       are copyright © and ™ Mantic Games. The event image is [The Battle of Borath Lei](
       https://www.manticgames.com/wallpapers/) © Mantic Games. Chesterfield Open Gaming Society is
       not associated with Mantic Games in any way.`,
    ),
    eventPack: [
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
https://kow.c-o-g-s.org.uk/event/cogs-of-war-2024/sign-up).

Tickets are priced at £18, [payable via PayPal](
https://www.paypal.com/paypalme/KamiOfTea/18).

If you’d prefer to pay using a different payment method, please contact 
the tournament organiser.

Tickets can be cancelled for a full refund until Thursday 22nd March. 
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
You will need a 1995 point Kings of War army.  This should be built using the standard army 
selection and composition rules in the 3.5 edition core rulebook with the updates in Clash of Kings 
2024.

The optional rules for Allies **CAN** be used.

You can submit your list on the <a href="/event/cogs-of-war-2024/edit-details">
edit details page</a>. Alternatively 
[email a pdf of your list to jeff@goblinoid.co.uk](
mailto:jeff@goblinoid.co.uk). Your list should be submitted by 23:59 on 
Sunday 7th April.

Players will receive +3 tournament points if they submit on time. This 
will reduce by one point per day or part-day since the submission time 
that has passed before the list is received, to a minimum of 0 if it is three
or more days late.

Part of the joy of wargaming is the spectacle of two armies clashing on the table-top. We would 
prefer players to bring a fully painted and based army that fits with the fantasy wargaming 
aesthetic.

It should be clear to your opponent what each unit in your army represents.

Steve Pearson is our spare player in the event that we have an odd number of 
attendees. His list will be published prior to the submission deadline.
`),
      },
      {
        title: "Things to bring with you",
        content: unsafeRenderMarkdown(`
- Your 1995 point army. 
- Three copies of your list.
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
capacity. Please contact us if you need to reserve a space for 
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
| Registration | 10:00      |
| Briefing     | 10:20      |
| Game one     | 10:30      |
| Lunch        | 12:30      |
| Game two     | 13:15      |
| Break        | 15:15      |
| Game three   | 15:30      |
| Awards       | 17:30      |
| Close        | 17:45      |

The schedule may need to be adjusted on the day.`),
      },
      {
        title: "Playing the games",
        content: unsafeRenderMarkdown(`
The event will be using the rules in the 3.5 edition core rulebook, along 
with the updates in Clash of Kings 2024, and any FAQ or errata published 
by Mantic Games prior to the event.
 
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

There will be up to seven victory points available for each scenario, with 
at most three points scored if you draw or lose. These will also count as 
tournament points (TPs).

You get five bonus tournament points if you win the scenario, two bonus points
if you draw.

You get up to three bonus tournament points based on the total points of
enemy units you routed during the game.
 
| Total points routed | Bonus TPs |
| ------------------- | --------- |
|  500+               | +1        |
| 1100+               | +2        |
| 1695+               | +3        |

Players will therefore score up to fifteen tournament points per round. 
With three list submission points, the maximum available tournament 
score is 48.`),
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
    eventPackPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "cogs-of-war-2024-tournament-pack.pdf",
    },
    costInPounds: 18,
    payPalLink: "https://www.paypal.com/paypalme/KamiOfTea/18",
    maxAttendees: 20,
    additionalFields: [
      {
        name: "army_list",
        type: "ARMY_LIST",
        readonly: true,
        label: "Army list",
      },
      {
        name: "faction",
        type: "STRING",
        readonly: true,
        label: "Faction",
      },
      {
        name: "allies",
        type: "STRING",
        readonly: true,
        label: "Allies",
      },
      {
        name: "tournament_points",
        type: "SCORE",
        readonly: true,
        label: "Tournament points",
      },
      {
        name: "total_routed",
        type: "SCORE",
        readonly: true,
        label: "Total routed",
      },
      {
        name: "total_attrition",
        type: "SCORE",
        readonly: true,
        label: "Total attrition",
      },
      {
        name: "bonus_points",
        type: "SCORE",
        readonly: true,
        label: "Bonus points",
      },
      {
        name: "awards",
        type: "STRING",
        readonly: true,
        label: "Awards",
      },
    ],
    listsSubmissionClosed: true,
    sparePlayer: {
      name: "Steve Pearson",
      email: "jammystavros@hotmail.com",
      listPdfUrl: {
        base: "https://static.goblinoid.co.uk/",
        name: "cogs-of-war-2024-spare-player-list.pdf",
      },
    },
    scenarios: [
      {
        scenario: Plunder,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Plunder.png",
        roundEnd: "2024-04-14 12:30:00",
      },
      {
        scenario: Control,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Control.png",
        roundEnd: "2024-04-14 15:15:00",
      },
      {
        scenario: Pillage,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Pillage.png",
        roundEnd: "2024-04-14 17:40:00",
      },
    ],
    scenarioPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "cogs-of-war-2024-scenarios-and-scoring.pdf",
    },
    bonusPoints: {
      win: 5,
      draw: 2,
    },
    pointsLimit: 1995,
    kowMastersEventId: 369,
    kowMastersSeason: 9,
    manticCompanionEventId: 249,
  },
  {
    title: "Cogs of War 2025",
    subtitle: "A Kings of War Tournament",
    slug: "cogs-of-war-2025",
    titlePositionX: "1rem",
    titleStyles: { alignSelf: "end" },
    date: dayjs("2025-04-06"),
    imageUrl: "cogs-of-war-2025.png",
    imageDescription:
      "A naiad and a succubus clash with an armies in the background." +
      " Most of the image is in greyscale, but the naiad is monochrome yellow.",
    openGraph: {
      imageUrl:
        "https://kow.c-o-g-s.org.uk/_static/images/cogs-of-war-2025-og.png",
      imageAlt:
        "A naiad and a succubus clash with an armies in the background." +
        "Most of the image is in greyscale, but the naiad is monochrome yellow. " +
        'Superimposed on top of this is the COGS logo and the text "Chesterfield ' +
        "Open Gaming Society Presents Cogs of War 2025, A Kings of War Tournament, " +
        '6th April 2025"',
    },
    description: `A one-day Kings of War singles tournament using the 3.5 edition rules and the 
    Clash of Kings 2025 updates.`,
    about: {
      What: ["20 players, 1995 points, 3 games"],
      When: ["6th April 2025, 10:00 until 17:45"],
      Where: [
        "The Parish Centre",
        "Stonegravels",
        "91 Sheffield Road",
        "Chesterfield",
        "S41 7JH",
      ],
    },
    signUpEnabled: false,
    disclaimer: renderMarkdownInline(
      `Mantic® and Kings of War® and all associated names, characters, places, and things
       are copyright © and ™ Mantic Games. The original event image © Mantic Games. 
       Chesterfield Open Gaming Society is not associated with Mantic Games in any way.`,
    ),
    eventPack: [
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
https://kow.c-o-g-s.org.uk/event/cogs-of-war-2025/sign-up).

Tickets are priced at £18, [payable via PayPal](
https://www.paypal.com/paypalme/KamiOfTea/18).

If you’d prefer to pay using a different payment method, please contact 
the tournament organiser.

Tickets can be cancelled for a full refund until Thursday 14th March. 
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
You will need a 1995 point Kings of War army.  This should be built using the standard army 
selection and composition rules in the 3.5 edition core rulebook with the updates in Clash of Kings 
2025.

### Optional rules 

* Allies **MAY** be used
* Command dice will **NOT** be used
* Withdraw rule will **NOT** be in play. 

You can submit your list on the <a href="/event/cogs-of-war-2025/edit-details">
edit details page</a>. Alternatively 
[email a pdf of your list to jeff@goblinoid.co.uk](
mailto:jeff@goblinoid.co.uk). Your list should be submitted by 23:59 on 
Sunday 30th March.

Players will receive +3 tournament points if they submit on time. This 
will reduce by one point per day or part-day since the submission time 
that has passed before the list is received, to a minimum of 0 if it is three
or more days late.

Part of the joy of wargaming is the spectacle of two armies clashing on the table-top. We would 
prefer players to bring a fully painted and based army that fits with the fantasy wargaming 
aesthetic.

It should be clear to your opponent what each unit in your army represents.
`),
      },
      {
        title: "Things to bring with you",
        content: unsafeRenderMarkdown(`
- Your 1995 point army. 
- Three copies of your list.
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
capacity. Please contact us if you need to reserve a space for 
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
| Registration | 10:00      |
| Briefing     | 10:20      |
| Game one     | 10:30      |
| Lunch        | 12:30      |
| Game two     | 13:15      |
| Break        | 15:15      |
| Game three   | 15:30      |
| Awards       | 17:30      |
| Close        | 17:45      |

The schedule may need to be adjusted on the day.`),
      },
      {
        title: "Playing the games",
        content: unsafeRenderMarkdown(`
The event will be using the rules in the 3.5 edition core rulebook, along 
with the updates in Clash of Kings 2025, and any FAQ or errata published 
by Mantic Games prior to the event.
 
The optional withdraw rule will **NOT** be in play. Command dice will **NOT** 
be used.

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

There will be up to seven victory points available for each scenario, with 
at most three points scored if you draw or lose. These will also count as 
tournament points (TPs).

You get five bonus tournament points if you win the scenario, two bonus points
if you draw.

You get up to three bonus tournament points based on the total points of
enemy units you routed during the game.
 
| Total points routed | Bonus TPs |
| ------------------- | --------- |
|  500+               | +1        |
| 1100+               | +2        |
| 1695+               | +3        |

Players will therefore score up to fifteen tournament points per round. 
With three list submission points, the maximum available tournament 
score is 48.`),
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
    eventPackPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "cogs-of-war-2025-tournament-pack.pdf",
    },
    costInPounds: 18,
    payPalLink: "https://www.paypal.com/paypalme/KamiOfTea/18",
    additionalFields: [
      {
        name: "army_list",
        type: "ARMY_LIST",
        readonly: true,
        label: "Army list",
      },
      {
        name: "faction",
        type: "STRING",
        readonly: true,
        label: "Faction",
      },
      {
        name: "allies",
        type: "STRING",
        readonly: true,
        label: "Allies",
      },
      {
        name: "tournament_points",
        type: "SCORE",
        readonly: true,
        label: "Tournament points",
      },
      {
        name: "total_routed",
        type: "SCORE",
        readonly: true,
        label: "Total routed",
      },
      {
        name: "total_attrition",
        type: "SCORE",
        readonly: true,
        label: "Total attrition",
      },
      {
        name: "bonus_points",
        type: "SCORE",
        readonly: true,
        label: "Bonus points",
      },
      {
        name: "awards",
        type: "STRING",
        readonly: true,
        label: "Awards",
      },
    ],
    sparePlayer: {
      name: "Steve Pearson",
      email: "jammystavros@hotmail.com",
      listPdfUrl: {
        base: "https://static.goblinoid.co.uk/",
        name: "cogs-of-war-2025-spare-player-list.pdf",
      },
    },
    scenarios: [
      {
        scenario: CompassPoints,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/CompassPoints2025.png",
      },
      {
        scenario: GoldRush,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/GoldRush2025.png",
      },
      {
        scenario: Control,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Control2025.png",
      },
    ],
    scenarioPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "cogs-of-war-2025-scenarios-and-scoring.pdf",
    },
    maxAttendees: 20,
    bonusPoints: {
      win: 5,
      draw: 2,
    },
    pointsLimit: 1995,
    kowMastersEventId: 431,
    kowMastersSeason: 10,
    manticCompanionEventId: 424,
    listsSubmissionClosed: true,
  },
  {
    title: "Clockwork 2025",
    subtitle: "A Kings of War Speed Tournament",
    slug: "clockwork-2025",
    titlePositionX: "1rem",
    titleStyles: { alignSelf: "end" },
    date: dayjs("2025-11-16"),
    imageUrl: "clockwork-2025.png",
    imageDescription:
      "A riftforged orc army led by a Stormbringer on Helstrike Manticore clashes " +
      "with a halfling army let by a Muster captain on Aralez. Most of the image " +
      "is in greyscale, but the front line of the orc force is in monochrome " +
      "yellow.",
    openGraph: {
      imageUrl:
        "https://kow.c-o-g-s.org.uk/_static/images/clockwork-2025-og.png",
      imageAlt:
        "A riftforged orc army led by a Stormbringer on Helstrike Manticore clashes " +
        "with a halfling army let by a Muster captain on Aralez. Most of the image " +
        "is in greyscale, but the front line of the orc force is in monochrome " +
        "yellow. Superimposed on top of this is the COGS logo and the text " +
        '"Chesterfield Open Gaming Society Presents Clockwork 2025, A Kings of ' +
        'War Speed Tournament, 16th November 2025"',
    },
    description:
      "A one-day Kings of War speed tournament using the 3.5 edition rules and the " +
      "Clash of Kings 2025 updates.",
    about: {
      What: ["16 players, 1000 points, 5 games"],
      When: ["16th November 2025, 10:00 until 17:00"],
      Where: [
        "The Parish Centre",
        "Stonegravels",
        "91 Sheffield Road",
        "Chesterfield",
        "S41 7JH",
      ],
    },
    signUpEnabled: false,
    disclaimer: renderMarkdownInline(
      `Mantic® and Kings of War® and all associated names, characters, places, and things
       are copyright © and ™ Mantic Games. The original event image © Mantic Games. 
       Chesterfield Open Gaming Society is not associated with Mantic Games in any way.`,
    ),
    eventPack: [
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

Tickets are priced at £18, [payable via PayPal](
https://www.paypal.com/paypalme/KamiOfTea/18).

If you’d prefer to pay using a different payment method, please contact 
the tournament organiser.

Tickets can be cancelled for a full refund until Thursday 23rd October. 
After this, we will only offer a refund if we can fill your place.`),
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
You will need a 1000 point Kings of War army. This should be built using
the standard army selection and composition rules in the Kings of War version 
3.5 compendium, the rules updates in Clash of Kings 2025, and the rules from
Clash of Kings 2024 that were not reprinted (e.g. the updated Twilight Kin 
army list.)

### Optional rules 

* Allies **MAY** be used
* Command dice will **NOT** be used
* Withdraw rule will **NOT** be in play. 

You can submit your list on the <a href="/event/clockwork-2025/edit-details">
edit details page</a>. Alternatively 
[email a pdf of your list to jeff@goblinoid.co.uk](
mailto:jeff@goblinoid.co.uk). Your list should be submitted by 23:59 on 
Sunday 9th November.

Players will receive +3 tournament points if they submit on time. This 
will reduce by one point per day or part-day since the submission time 
that has passed before the list is received, to a minimum of 0 if it is three
or more days late.

Part of the joy of wargaming is the spectacle of two armies clashing on the
table-top. Please bring a fully painted and based army that fits with 
the fantasy wargaming aesthetic. However, we will not penalise players if
they have a good reason they can’t – no questions asked.

It should be clear to your opponent what each unit in your army 
represents.

Steve Pearson is our spare player, in the event of an odd number of players 
he'll use this list:

<div class="uploaded-file">
  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
       stroke-linejoin="round" height="3em" width="3em" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
  <span class="file-name">Clockwork 2025 - Spare Player.pdf</span>
  <a
    href="https://static.goblinoid.co.uk/clockwork-2025-spare-player-list.pdf"
    download="clockwork-2025-spare-player-list.pdf"
    target="_blank"
    rel="noreferrer noopener"
    class="button primary"
  >
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
         stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download
  </a>
</div>

In the event that the tournament needs an extra player to qualify for UK masters'
rankings, the tournament organiser will also play using this list:

<div class="uploaded-file">
  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
       stroke-linejoin="round" height="3em" width="3em" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
  <span class="file-name">Clockwork 2025 - Low Player Count List.pdf</span>
  <a
    href="https://static.goblinoid.co.uk/clockwork-2025-low-player-count-list.pdf"
    download="clockwork-2025-low-player-count-list.pdf"
    target="_blank"
    rel="noreferrer noopener"
    class="button primary"
  >
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
         stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download
  </a>
</div>
`),
      },
      {
        title: "Things to bring with you",
        content: unsafeRenderMarkdown(`
- Your 1000 point army.
- Three copies of your list.
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
The time allowed for games will decrease throughout the day:

* Games one and two: 25 minutes per player
* Games three and four: 20 minutes per player
* Game five: 15 minutes per player

Due to the short round times, there will be no roll for turn seven. Each game 
will only be played for six rounds.

|              | Start Time |
| ------------ | ---------- |
| Registration |  9:45      |
| Briefing     | 10:15      |
| Game one     | 10:30      |
| Break        | 11:30      |
| Game two     | 11:45      |
| Lunch        | 12:45      |
| Game three   | 13:45      |
| Break        | 14:35      |
| Game four    | 14:50      |
| Break        | 15:45      |
| Game five    | 16:00      |
| Awards       | 16:45      |
| Close        | 17:00      |

The schedule may need to be adjusted on the day.`),
      },
      {
        title: "Playing the games",
        content: unsafeRenderMarkdown(`
The event will be using the rules in Kings of War version 3.5 compendium, the
rules updates in Clash of Kings 2025, and the rules from Clash of Kings 2024
that were not reprinted (e.g. the updated Twilight Kin army list.)

Chess clocks will be used to help the tournament run on schedule. Clocks
should be used throughout deployment, scout moves, and player turns.
 
If you and your opponent disagree on a rule, pause the clock whilst you 
check the rulebook. If that doesn’t resolve your issue, please ask the 
tournament organiser to adjudicate.

The clock should also be paused if either player needs to take a break 
for any reason.

Unlike Cogs of War tournaments, timing out is strictly dice down. If you run out
of time on the clock, you must instantly stop play. If you are currently 
rolling a combat or shooting attack, no wounds are applied from the attack and
the target is steady.

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

Full details of the scenario to be played and how to score victory 
points will be provided at the start of each round.

There will be up to 5 victory points available for each scenario, with 
at most 2 points scored if you draw or lose. These will also count as 
tournament points (TPs).

You get 5 bonus tournament points if you win the scenario, 2 bonus points
if you draw.

You get up to three bonus tournament points based on the total points of
enemy units you routed during the game.
 
| Total points routed | Bonus TPs |
| ------------------- | --------- |
|  250+               | +1        |
|  550+               | +2        |
|  850+               | +3        |

Players will therefore score up to thirteen tournament points per round. 
With three list submission points, the maximum available tournament 
score is 68.`),
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
    eventPackPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "clockwork-2025-tournament-pack.pdf",
    },
    costInPounds: 18,
    payPalLink: "https://www.paypal.com/paypalme/KamiOfTea/18",
    sparePlayer: {
      name: "Steve Pearson",
      email: "jammystavros@hotmail.com",
      listPdfUrl: {
        base: "https://static.goblinoid.co.uk/",
        name: "clockwork-2025-spare-player-list.pdf",
      },
    },
    lowAttendeesPlayer: {
      name: "Jeff Horton",
      email: "jeff@goblinoid.co.uk",
      listPdfUrl: {
        base: "https://static.goblinoid.co.uk/",
        name: "clockwork-2025-low-player-count-list.pdf",
      },
    },
    scenarios: [
      {
        scenario: SmallFoolsGold,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Clockwork2025FoolsGold.png",
      },
      {
        scenario: SmallDominate,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Clockwork2025Dominate.png",
      },
      {
        scenario: SmallStockpile,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Clockwork2025Stockpile.png",
      },
      {
        scenario: SmallPillage,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Clockwork2025Pillage.png",
      },
      {
        scenario: SmallControl,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Clockwork2025Control.png",
      },
    ],
    scenarioPdfUrl: {
      base: "https://static.goblinoid.co.uk/",
      name: "clockwork-2025-scenarios-and-scoring.pdf",
    },
    bonusPoints: {
      win: 5,
      draw: 2,
    },
    maxAttendees: 16,
    pointsLimit: 1000,
    kowMastersEventId: 430,
    kowMastersSeason: 10,
    manticCompanionEventId: 425,
    listsSubmissionClosed: true,
    additionalFields: [
      {
        name: "army_list",
        type: "ARMY_LIST",
        readonly: true,
        label: "Army list",
      },
      {
        name: "faction",
        type: "STRING",
        readonly: true,
        label: "Faction",
      },
      {
        name: "allies",
        type: "STRING",
        readonly: true,
        label: "Allies",
      },
      {
        name: "tournament_points",
        type: "SCORE",
        readonly: true,
        label: "Tournament points",
      },
      {
        name: "total_routed",
        type: "SCORE",
        readonly: true,
        label: "Total routed",
      },
      {
        name: "total_attrition",
        type: "SCORE",
        readonly: true,
        label: "Total attrition",
      },
      {
        name: "bonus_points",
        type: "SCORE",
        readonly: true,
        label: "Bonus points",
      },
      {
        name: "awards",
        type: "STRING",
        readonly: true,
        label: "Awards",
      },
    ],
    bands: [
      [850, 3],
      [550, 2],
      [250, 1],
    ],
  },
];

const tournamentsBySlug = Object.fromEntries(
  tournaments.map((e) => [e.slug, e]),
);

export async function getTournamentBySlug(
  slug: string,
): Promise<Tournament | undefined> {
  const db = await arc.tables();
  const base = tournamentsBySlug[slug];

  if (!base) {
    return undefined;
  }

  const overrides = ((await db.tournament.get({
    slug,
  })) ?? {}) as Partial<Tournament>;

  return merge(base, overrides);
}

export async function upsertTournamentOverride(
  slug: string,
  override: DeepPartial<Tournament>,
  unsets?: string[],
) {
  const db = await arc.tables();

  const existing = (await db.tournament.get({
    slug,
  })) as Partial<Tournament> | undefined;

  const withUnsets = (unsets ?? []).reduce((acc, path) => {
    unset(acc, path);
    return acc;
  }, existing ?? {});

  const updated = merge({ slug }, withUnsets, override);

  await db.tournament.put(updated);
}
