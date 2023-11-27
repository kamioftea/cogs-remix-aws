import type { Breadcrumb } from "~/utils/breadcrumbs";
import { Breadcrumbs, CURRENT } from "~/utils/breadcrumbs";
import type { LinksFunction } from "@remix-run/node";
import stylesheetUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: "Accessibility Statement",
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export default function AccessibilityStatement() {
  return (
    <>
      <section role="banner" className="cogs-header margin-bottom-1">
        <img
          src="/_static/images/logo.png"
          alt="Chesterfield Open Gaming Society Logo"
          className="logo"
        />
        <span className="h1 club-name">Chesterfield Open Gaming Society</span>
        <h1>
          Accessibility statement for Kings of War
          <br /> organised play
        </h1>
      </section>

      <Breadcrumbs />

      <main>
        <p className="lead">
          Chesterfield Open Gaming Society is dedicated to providing an
          inclusive, gaming experience that is accessible to everyone.
        </p>
        <h2>The website</h2>
        <p>
          We want as many people as possible to be able to use this website. For
          example, that means you should be able to:
        </p>
        <ul>
          <li>zoom in up to 200% without the text spilling off the screen,</li>
          <li>navigate the website using just a keyboard,</li>
          <li>navigate the website using speech recognition software,</li>
          <li>
            listen to most of the website using a screen reader (including the
            most recent versions of JAWS, NVDA and VoiceOver)
          </li>
        </ul>
        <p>
          We&rsquo;ve also tried to make the website text as simple as possible
          to understand.
        </p>
        <p>
          <a href="https://mcmw.abilitynet.org.uk/" rel="noreferrer noopener">
            AbilityNet has advice on making your device easier to use
          </a>{" "}
          if you have a disability.
        </p>
        <h2>The venue</h2>
        <p>
          The venue is wheelchair accessible and we will ensure there is space
          between tables for everyone to comfortably play their games. Please
          get in touch if you'd like to reserve a more accessible parking spot.
        </p>

        <h2>Feedback and contact information</h2>
        <p>
          If there is anything that we can do to make it easier or more
          enjoyable for you to attend, please let us know. Particularly if
          anything about the event, website, or venue is inaccessible we want to
          know so that we can fix it.
        </p>
        <p>
          Please contact <a href="mailto:jeff@goblinoid.co.uk">Jeff Horton</a>{" "}
          if you have any feedback or questions.
        </p>
      </main>
    </>
  );
}
