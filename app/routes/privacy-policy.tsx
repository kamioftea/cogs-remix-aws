import type { Breadcrumb } from "~/utils/breadcrumbs";
import { Breadcrumbs, CURRENT } from "~/utils/breadcrumbs";
import type { LinksFunction } from "@remix-run/node";
import stylesheetUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: "Privacy policy",
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
        <h1>Privacy policy for Kings of War organised play</h1>
      </section>

      <Breadcrumbs />

      <main>
        <p className="lead">
          This policy explains what data we store about you, why, and for how
          long. It explains how we protect that data, and how you can correct or
          remove data we store.
        </p>
        <h2>Contact us</h2>
        <p>
          You can contact us at anytime for more information, to find out what
          data we currently hold about you, or to change or remove that data.
          Please email{" "}
          <a href="mailto:jeff@goblinoid.co.uk">jeff@goblinoid.co.uk</a>.
        </p>
        <h2>What we store</h2>
        <dl>
          <dt>Email address</dt>
          <dd>
            We store an email address for each attendee so that we can contact
            you with important information about the event. We also use this to
            verify only you can access and modify your personal information by
            sending one-use sign in or password reset links to that address. We
            will not share your email with any third-party, nor use it to
            contact you about events you have not registered to attend.
          </dd>
          <dd>
            Emails associated with an event will be removed from the system
            within one week, once we are sure we will not need to contact
            attendees further. We offer setting up a longer term account to
            avoid re-entering data for multiple events. If you set up an account
            we will keep your email until you close that account.
          </dd>

          <dt>Password</dt>
          <dd>
            You can optionally setup a long-term account with us to make it
            easier to sign up to multiple events. If you do, we will store a
            password to use when signing into that account. This will be stored
            using one-way encryption. This means we can determine if it matches
            a password you provide when signing in, but it is not possible to
            determine from the stored data what that password is.
          </dd>

          <dt>Display name</dt>
          <dd>
            We store a name which will be publicly available when listing
            attendees, when showing table assignments and in games results.
            Whilst the event page is active you will have the option to edit
            your name online. Once the event is archived you can email us to
            make changes.
          </dd>

          <dt>Event information</dt>
          <dd>
            We will store a copy of your army list, and the scores you submit
            for each game you play. These will be made publicly available on the
            event page. Whilst the event page is active you will be able to
            manage this data yourself. Once the event is archived you can email
            us to make changes.
          </dd>
        </dl>
        <h2>Cookies</h2>
        <p>
          Cookies are small pieces of data that websites can store on your
          computer to track who you are.
        </p>
        <p>
          When you are browsing this site we do not store any cookies unless you
          choose to sign in to manage the data we store about you. When you sign
          in using a one-time url we have sent to, or using a password, we will
          store a cookie named "__session" until you close your browser or you
          sign out.
        </p>
        <h2>Kings of War masters rankings</h2>
        <p>
          We will submit your chosen display name, army list, and scores to the
          Kings of War masters committee. How they will use this data is
          governed by their{" "}
          <a
            href="https://kowmasters.com/index.php?p=privacy"
            rel="noreferrer noopener"
          >
            privacy policy
          </a>
          .
        </p>
        <h2>How we protect your data.</h2>
        <p>
          The site is accessible using the HTTPS protocol. This means that any
          data you submit to us is encrypted as it travels over the internet. We
          use Amazon's Dynamo DB to store your data, including using encryption
          keys to ensure it is encrypted when stored.
        </p>
        <p>
          We have a suite of automated tests to verify that the data we store is
          only available to those with the correct access. We also use
          third-party tools to scan for known vulnerabilities.
        </p>
        <p>
          The code used to provide this website is{" "}
          <a href="https://github.com/kamioftea/cogs-remix-aws">
            publicly available on GitHub
          </a>
          .
        </p>
      </main>
    </>
  );
}
