import type { Breadcrumb} from "~/utils/breadcrumbs";
import { Breadcrumbs, CURRENT } from "~/utils/breadcrumbs";
import type { LinksFunction } from "@remix-run/node";
import stylesheetUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: "Code of Conduct",
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export default function CodeOfConductPage() {
  return (
    <>
      <section role="banner" className="cogs-header margin-bottom-1">
        <img
          src="/_static/images/logo.png"
          alt="Chesterfield Open Gaming Society Logo"
          className="logo"
        />
        <span className="h1 club-name">Chesterfield Open Gaming Society</span>
        <h1>Code of Conduct</h1>
      </section>

      <Breadcrumbs />
      <main>
        <p>
          All attendees, sponsors, and volunteers at our events are required to
          agree with the following code of conduct. Organisers will enforce this
          code throughout the event. We expect cooperation from all participants
          to help ensure a safe environment for everybody.
        </p>

        <h2>The Quick Version</h2>

        <p className="lead">
          Chesterfield Open Gaming Society is dedicated to providing an
          inclusive, harassment-free gaming experience for everyone, regardless
          of gender, gender identity and expression, age, sexual orientation,
          disability, physical appearance, body size, race, ethnicity, religion
          (or lack thereof), or hobby choices. We do not tolerate harassment of
          event participants in any form.
        </p>
        <p className="lead">
          This applies to our events, as well as to any associated social events
          and posts on Facebook and other online media. Event participants
          violating these rules may be sanctioned or expelled from the event
          without a refund at the discretion of the organisers.
        </p>

        <h2>The Less Quick Version</h2>

        <p>
          Harassment includes offensive verbal comments related to gender,
          gender identity and expression, age, sexual orientation, disability,
          physical appearance, body size, race, ethnicity, religion, hobby
          choices, sexual images in public spaces, deliberate intimidation,
          stalking, following, harassing photography or recording, sustained
          disruption of games or other activities at the event, inappropriate
          physical contact, and unwelcome sexual attention.
        </p>

        <p>
          Participants asked to stop any harassing behavior are expected to
          comply immediately.
        </p>

        <p>
          If a participant engages in harassing behavior, the event organisers
          may take any action they deem appropriate, including warning the
          offender or expulsion from the event with no refund.
        </p>

        <p>
          If you are being harassed, notice that someone else is being harassed,
          or have any other concerns, please contact one of the event organisers
          immediately. The organisers for an event will be listed in the event
          pack, and identified on the day during introductions and
          announcements.
        </p>
        <p>
          The event organisers will be happy to assist those experiencing
          harassment to feel safe for the duration of the event. We value your
          attendance.
        </p>
        <p>
          You can also contact the following Chesterfield Open Gaming Society
          committee members regarding any event run by or on behalf of
          Chesterfield Open Gaming Society.
        </p>

        <ul>
          <li>
            <a href="mailto:wiseone@tiscali.co.uk">Dave</a>
          </li>
          <li>
            <a href="mailto:yith@yith.co.uk">Yith</a>
          </li>
          <li>
            <a href="mailto:jeff@goblinoid.co.uk">Jeff</a>
          </li>
        </ul>

        <p>
          We expect participants to follow these rules during club events, as
          well as to any associated social events and when posting about the
          event or Chesterfield Open Gaming Society on Facebook and other online
          media.
        </p>

        <p className="disclaimer">
          This code of conduct was adapted from the{" "}
          <a href="http://confcodeofconduct.com/">conference code of conduct</a>
          , which is licensed under a{" "}
          <a href="http://creativecommons.org/licenses/by/3.0/deed.en_US">
            Creative Commons Attribution 3.0 Unported License
          </a>
          .
        </p>
        <p className="disclaimer">
          Wolfsbane II font ©
          <a href="https://www.iconian.com/index.html">Iconian Fonts</a>{" "}
          licenced for non-commercial use.
        </p>
      </main>
    </>
  );
}
