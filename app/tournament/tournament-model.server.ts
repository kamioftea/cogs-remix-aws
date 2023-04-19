import { renderMarkdownInline, unsafeRenderMarkdown } from "~/utils/markdown";
import type { AdditionalFieldType } from "~/tournament/additional-fields";
import type { Scenario } from "~/tournament/scenario/scenario";
import { Loot } from "~/tournament/scenario/loot";
import { FoolsGold } from "~/tournament/scenario/fools-gold";
import { Invade } from "~/tournament/scenario/invade";

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
  scenarios: {
    scenario: Scenario;
    mapUrl: string;
  }[];
}

export interface OpenGraphMeta {
  imageUrl: string;
  imageType?: string;
  imageAlt: string;
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
      Mantic Games. Chesterfield Open Gaming Society is not associated with Mantic Games in any way.`
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
    ],
    listsSubmissionClosed: true,
    scenarios: [
      {
        scenario: Loot,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Loot.png",
      },
      {
        scenario: FoolsGold,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/FoolsGold.png",
      },
      {
        scenario: Invade,
        mapUrl:
          "https://static.goblinoid.co.uk/kow.c-o-g-s.org.uk/maps/Invade.png",
      },
    ],
  },
  //   {
  //     title: "Twilight Expansion",
  //     subtitle: "A Kings of War escalation campaign",
  //     slug: "twilight-expansion",
  //     titlePosition: "min(12.75rem, 25vw)",
  //     imageUrl: "escalation.png",
  //     imageDescription: `A mighty army of skeleton warriors marches against a small force of elves. Most of the image is
  //                        in greyscale, but the elf force is monochrome yellow.`,
  //     openGraph: {
  //       imageUrl:
  //         "https://kow.c-o-g-s.org.uk/_static/images/twilight-expansion-og.png",
  //       imageAlt:
  //         "A mighty army of skeleton warriors marches against a small force of elves. Most of the image is in greyscale, but the elf force is monochrome yellow.",
  //     },
  //     signUpEnabled: true,
  //     description: `A monthly Kings of War campaign with escalating points and unit choices`,
  //     about: {
  //       Points: ["500 to 2300"],
  //       When: [
  //         "Starting February 2023",
  //         "19:00 - 22:00 Mondays, or 2nd and 4th Wednesdays",
  //       ],
  //       Where: [
  //         "The Parish Centre",
  //         "Stonegravels",
  //         "91 Sheffield Road",
  //         "Chesterfield",
  //         "S41 7JH",
  //       ],
  //     },
  //     disclaimer: renderMarkdownInline(
  //       `Mantic® and Kings of War® and all associated names, characters, places, and things are copyright © and
  //        ™ Mantic Games. The event image is [The Battle of Borath Lei](https://www.manticgames.com/wallpapers/) ©
  //        Mantic Games. Chesterfield Open Gaming Society is not associated with Mantic Games in any way. `
  //     ),
  //     eventPack: [
  //       {
  //         title: "Campaign Schedule",
  //         content: renderMarkdown(`
  // You will pick a single force list to use in all of your campaign games. Each
  // month you will be paired with an opponent, and will play a game with the
  // following points values:
  //
  // | Month     | Points  | Army selection and composition |
  // |-----------|---------|--------------------------------|
  // | February  | 500     | Ambush                         |
  // | March     | 750     | Ambush                         |
  // | April     | 1000    | Standard                       |
  // | May       | 1250    | Standard                       |
  // | June      | 1500    | Standard                       |
  // | July      | 1750    | Standard                       |
  // | August    | 2000    | Standard                       |
  // | September | 2300    | Standard                       |
  //
  // The first month's pairings will be random. The pairings and scenarios to be
  // played will be announced at the start of the month.
  //         `),
  //       },
  //       {
  //         title: "Territories and list building",
  //         content: unsafeRenderMarkdown(`
  // When picking your Kings of War force, you are limited by the territory you
  // control. Each territory will unlock one or more specific unit types from those
  // available in your chosen force list. When you claim a territory, you will choose
  // which unit type it will unlock.
  //
  // You may use any number / size of the unlocked unit types in your list, but must
  // still follow the standard rules for unlocking units, and the restrictions on
  // duplicates and unit types for that month’s points value. These are detailed in
  // the Kings of War 3.5 edition rulebook in the army selection and army composition
  // sections. Check page 86 for ambush games, and pages 46 to 49 for standard games.
  //
  // You can use any number of magical artefacts using the normal rules. Formations
  // can be taken in games that use standard army selection.
  //
  // Allied units can't be unlocked via territories, and therefore can't be included
  // in your army.
  //
  // ### Territories
  //
  // | Type          | Unlocks                                        |
  // |---------------|------------------------------------------------|
  // | Base Camp     | Two standard unit types<br/>One hero unit type |
  // | Cave          | One monster unit type                          |
  // | Mountain      | One titan unit type                            |
  // | Forest        | One war machine unit type                      |
  // | Farm          | One standard unit type                         |
  // | Training Camp | One irregular or limited unit type             |
  //
  // A standard unit is any infantry. heavy infantry, large infantry, monstrous
  // infantry, cavalry, large cavalry, chariot, or swarm unit that is not irregular
  // or limited.
  //
  // At the start of the game you control one base camp and one other territory of
  // your choice. Each game you play allows you to control one extra territory that
  // is not a base camp.
  //
  // ### Example
  //
  // Alice has chosen Goblins as her force list. Alice selects Fleabag Riders,
  // Sharpsticks, and Wizzes as the unlocks from her Base Camp. She then selects a
  // forest for her second territory, and decides it will unlock Mawpup launchers.
  // For her first Kings of War game she will need to build a 500 point Ambush army
  // with just those units. She can have any number of Sharpstick regiments, and any
  // number of Fleabag Rider troops regiments. She can take up to one Wiz and one
  // Mawpup launcher if she has at least two other units to unlock them due to the
  // maximum duplicates rule.
  //
  // After the game she chooses to set up a training camp, unlocking Fleabag Rider
  // Sniffs. For her game in March she can take up to 750 points, and can take any
  // number of Fleabag Rider Sniff troops or regiments as long as she has enough
  // Sharpstick or Fleabag Rider units to unlock them.
  //
  // In April the game will now be 1000 points using standard army selection and
  // composition. She chooses to claim a cave and unlock Winggits as flyers are no
  // longer restricted. She can also now take her Sharpsticks as hordes or legions.
  //         `),
  //       },
  //       {
  //         title: "Scores and Ranking",
  //         content: renderMarkdown(`
  // Both Vanguard and Kings of War games will be scored out of maximum 13 points.
  // * Up to seven points from the scenario objectives.
  // * Up to three points for the game result.
  // * Up to three points for the amount of your opponent's force you routed.
  //
  // The precise kill point boundaries and objective scoring will be published with
  // the scenario announcement each month. If there are enough players that you will
  // not face every opponent then pairings will use Swiss ranking. Otherwise, pairings
  // will be random until everyone has faced each other, then any remaining games
  // will use Swiss ranking.
  //         `),
  //       },
  //       {
  //         title: "Sign up and February games",
  //         content: unsafeRenderMarkdown(`
  // It is intended that territory management and games result submissions will be
  // available online sometime in February. Until that is ready please [email results
  // to Jeff Horton](mailto:jeff@goblinoid.co.uk).
  //
  // ### February match ups
  //
  // These will be announced Sunday 12th February for those signed up by then, ready
  // for the first organised evening on Monday 13th February. You can still sign up
  // and play later in the month, we'll reach out to arrange this with you when you
  // sign up.
  //
  // ### February scenario
  //
  // <a href="https://static.goblinoid.co.uk/take-and-hold.pdf"
  //    download="take-and-hold.pdf"
  //    class="button primary hollow">Download a pdf copy of this scenario</a>
  //
  // #### Take...
  // _Your expeditions have entered the mists of the Twilight Glades. After a day of
  // slow progress you’ve decided to secure a base camp. As your scouts search for a
  // suitable spot, they encounter the vanguard of another expedition. You need to
  // secure a suitable glade._
  //
  // Before rolling off to choose sides, place an objective marker in the centre of
  // the board. Then each player places one objective marker. Roll off to see who
  // places their token first.
  //
  // At the end of the game, each player scores one point for each objective marker
  // they control. Take a note of how many points each player has routed.
  //
  // #### ...and hold!
  //
  // _You’ve staked your claim, but your rival has brought in re-enforcements and is
  // still too close for comfort. To secure the area you need to drive them out now._
  //
  // Keep the terrain from the first game as is, but the deployment zones will now be
  // on the left and right flanks of the battlefield. Place one loot token in the
  // centre of the board.
  //
  // If one player held more objectives than their opponent in the ‘Take...’ scenario,
  // they will pick which side of the board will be their deployment zone, but their
  // opponent will deploy the first unit.
  //
  // If the ‘Take...’ scenario was a draw, roll off to pick sides as normal.
  //
  // <figure>
  // <img src="https://static.goblinoid.co.uk/take-and-hold-map.png" alt="The board map" />
  // <figcaption>
  // There are two scoring zones of 6” circles, centred in the middle of the board,
  // 12” from the centre line. At the end of the game, players total the unit
  // strength of units with at least 50% of their footprint within each zone
  // </figcaption>
  // </figure>
  //
  // Players score:
  // * **1 Point** if they hold the loot token.
  // * **1 Point** if they have more unit strength than their opponent in the zone
  //   centred on the edge of their deployment zone.
  // * **2 Points** if they have more unit strength than their opponent in the zone
  //   centred on the edge of their opponent’s deployment zone.
  //
  // #### Campaign scoring
  //
  // Your campaign points total is:
  //
  // * The sum of your scores in the first and second game
  // * One point for each game you won
  // * One point if you won or drew in both games
  // * Add up the total points of your opponent's units that were routed in both
  //   games:
  //
  // | Total points routed | Campaign points |
  // | ------------------- | --------------- |
  // | 250+                | +1              |
  // | 550+                | +2              |
  // | 850+                | +3              |
  //         `),
  //       },
  //     ],
  //   },
];

const tournamentsBySlug = Object.fromEntries(
  tournaments.map((e) => [e.slug, e])
);

export function getTournamentBySlug(slug: string): Tournament | undefined {
  return tournamentsBySlug[slug];
}
