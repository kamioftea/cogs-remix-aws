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
import dayjs from "dayjs";

interface LoaderData {
  tournaments: Tournament[];
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ tournaments });
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
  const { tournaments } = useLoaderData<LoaderData>() as LoaderData;

  const [upcoming, previous] = useMemo(() => {
    const now = dayjs().endOf("day");
    const predicate = new Predicate<Tournament>((tournament) => {
      return dayjs(tournament.date ?? now).isAfter(now);
    });
    const [upcoming, previous] = predicate.partition(tournaments);

    const sortByDate = sortBy<Tournament>((t) => (t.date ?? now).unix());
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
        <h1>Kings of War</h1>
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
          our dedicated Kings of War evenings. The next of these is Monday 12th
          December,{" "}
          <a
            href="https://facebook.com/events/s/kow-1995pts1000pts/807563333639644/"
            target="_blank"
            rel="noreferrer"
          >
            see the Facebook event
          </a>{" "}
          for more details.
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
              {previous.map((tournament) => (
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
