import { Link, useLoaderData } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { FiChevronRight } from "react-icons/fi";

import stylesheetUrl from "~/styles/index.css";
import type { Tournament } from "~/tournament/tournament-model.server";
import { tournaments } from "~/tournament/tournament-model.server";
import { Fragment, useMemo } from "react";
import { Breadcrumbs } from "~/utils/breadcrumbs";
import { Predicate, sortBy } from "~/utils";
import type { ClubNight } from "~/club_night/club_night_model.server";
import { clubNights } from "~/club_night/club_night_model.server";
import dayjs from "dayjs";

import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

interface LoaderData {
  tournaments: Tournament[];
  club_night: ClubNight | undefined;
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const loader: LoaderFunction = async () => {
  const now = dayjs().startOf("day");
  let club_night = clubNights
    .sort(sortBy((cn) => cn.date))
    .find((cn) => !dayjs(cn.date).isBefore(now));
  return json<LoaderData>({ tournaments, club_night });
};

function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Fragment>
      <Link
        to={`/event/${tournament.slug}`}
        aria-labelledby={`${tournament.slug}-find-out-more`}
      >
        <section
          aria-labelledby={`${tournament.slug}-heading`}
          className="event"
        >
          <img
            src={`/_static/images/${tournament.imageUrl}`}
            alt={tournament.imageDescription}
            role="presentation"
          />
          <h3
            id="{{ event.data.title | kebabCase }}-heading"
            className="event-title"
          >
            {tournament.title}
            <br />
            <small>{tournament.subtitle}</small>
          </h3>
          <button
            className="button more-info"
            id={`${tournament.slug}-find-out-more`}
            type="button"
            tabIndex={-1}
          >
            {tournament.title} event page
            <FiChevronRight />
          </button>
        </section>
      </Link>
    </Fragment>
  );
}

export default function Index() {
  // noinspection JSUnusedLocalSymbols
  const { tournaments, club_night } = useLoaderData<LoaderData>() as LoaderData;

  const [upcoming, previous] = useMemo(() => {
    const now = dayjs().startOf("day");
    const predicate = new Predicate<Tournament>((tournament) => {
      return now.isBefore(dayjs(tournament.date ?? now).endOf("day"), "second");
    });
    const [upcoming, previous] = predicate.partition(tournaments);

    const sortByDate = sortBy<Tournament>((t) =>
      (t.date ? dayjs(t.date) : now).unix(),
    );
    upcoming.sort(sortByDate);
    previous.sort(sortByDate);

    return [upcoming, previous];
  }, [tournaments]);

  return (
    <>
      <section role="banner" className="cogs-header margin-bottom-1">
        <img
          src="/_static/images/logo.png"
          alt="Chesterfield Open Gaming Society Logo"
          className="logo"
        />
        <span className="h1 club-name">Chesterfield Open Gaming Society</span>
        <h1>Organised play</h1>
      </section>

      <Breadcrumbs />

      <main style={{ maxWidth: "960px", margin: "auto" }}>
        <p className="lead">
          Chesterfield Open Gaming Society has been playing Kings of War since
          first edition, and it is one of the most common games played at the
          club.
        </p>
        {upcoming.length > 0 && (
          <>
            <h2>Upcoming Events</h2>
            <div className="event-card-list">
              {upcoming.map((tournament) => (
                <TournamentCard tournament={tournament} key={tournament.slug} />
              ))}
            </div>
          </>
        )}
        <h2>Campaigns</h2>
        <div className="event-card-list">
          <Link
            to={`/campaign/moonstone`}
            aria-labelledby={`moonstone-find-out-more`}
          >
            <section aria-labelledby={`moonstone-heading`} className="event">
              <img
                src={`/_static/images/moonstone-campaign.png`}
                alt={
                  "Jayda shooting her bow in a thorny forest, whilst being" +
                  " beset by fairies. The image is monochrome, except Jayda" +
                  " and two prominent fairies are highlighted in Yellow."
                }
                role="presentation"
              />
              <h3 id="moonstone-heading" className="event-title">
                Into the Forsaken Forest
                <br />
                <small>A Moonstone escalation campaign</small>
              </h3>
              <button
                className="button more-info"
                id={`moonstone-find-out-more`}
                type="button"
                tabIndex={-1}
              >
                Into the Forsaken Forest campaign page
                <FiChevronRight />
              </button>
            </section>
          </Link>
        </div>

        <h2>Club Nights</h2>
        <p>
          As well as the organised play events, we also play Kings of War games
          on regular gaming club nights.
        </p>

        <p>
          Club nights are every Monday (except Bank Holidays), and the second
          and fourth Wednesdays of the month. They run from 19:00 to 22:00,
          which is usually adequate for a 2000 point game, or two 1000 point
          games. They are held at{" "}
          <a href="https://parishcentrestonegravels.co.uk/">
            The Parish Centre, Stonegravels
          </a>
          :
        </p>

        <p style={{ marginLeft: "2rem" }}>
          The Parish Centre
          <br />
          Stonegravels
          <br />
          91 Sheffield Road
          <br />
          Chesterfield
          <br />
          S41 7JH
        </p>

        <p>
          Please arrange a game with an opponent beforehand, or come to one of
          our dedicated Kings of War evenings.{" "}
          {club_night ? (
            <>
              The next of these is{" "}
              {dayjs(club_night.date).format("dddd Do MMMM")},{" "}
              <a
                href={club_night.facebook_event_url}
                target="_blank"
                rel="noreferrer"
              >
                see the Facebook event
              </a>{" "}
              for more details.
            </>
          ) : (
            <>
              These will be published as{" "}
              <a href="https://www.facebook.com/groups/main.cogs/events">
                COGS Facebook group events
              </a>
              .
            </>
          )}
        </p>

        <p>
          <a href="https://www.c-o-g-s.org.uk/p/about2.html">
            The main COGS website
          </a>{" "}
          has more details about the club, gaming nights, and other upcoming
          events.{" "}
          <a href="https://www.facebook.com/groups/main.cogs">
            Join our Facebook group
          </a>{" "}
          to keep up-to-date with what's going on at the club.
        </p>

        {previous.length > 0 && (
          <>
            <h2>Past Events</h2>
            <div className="event-card-list">
              {previous.reverse().map((tournament) => (
                <TournamentCard tournament={tournament} key={tournament.slug} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer>
        <p className="disclaimer">
          Mantic® and Kings of War® and all associated names, characters,
          places, and things are copyright © and ™ Mantic Games. Chesterfield
          Open Gaming Society is not associated with Mantic Games in any way.
        </p>
        <p className="disclaimer">
          Wolfsbane II font ©
          <a href="https://www.iconian.com/index.html">Iconian Fonts</a>{" "}
          licenced for non-commercial use.
        </p>
      </footer>
    </>
  );
}
