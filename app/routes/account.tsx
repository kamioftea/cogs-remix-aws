import { Link, Outlet } from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import stylesheetUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export default function AccountLayout() {
  return (
    <>
      <section role="banner" className="cogs-header margin-bottom-1">
        <img
          src="/_static/images/logo.png"
          alt="Chesterfield Open Gaming Society Logo"
          className="logo"
        />
        <span className="h1 club-name">Chesterfield Open Gaming Society</span>
        <h1>Organised Play Account</h1>
      </section>

      <nav aria-label="You are here:" role="navigation">
        <ul className="breadcrumbs">
          <li>
            <a href="https://www.c-o-g-s.org.uk/">Home</a>
          </li>
          <li>
            <Link to="/">Kings of War</Link>
          </li>
          <li>
            <span className="show-for-sr">Current: </span>Account Management
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
