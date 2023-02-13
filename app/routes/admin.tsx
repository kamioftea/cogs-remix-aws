import { Link, Outlet } from "@remix-run/react";
import stylesheetUrl from "../styles/admin.css";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUser } from "~/account/session.server";
import { Role } from "~/account/user-model";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request, [Role.Admin]);
  return json({});
};

export default function AdminLayout() {
  return (
    <>
      <div className="banner" role={"banner"}>
        <h1>Admin</h1>
      </div>
      <nav className="admin-sidebar" aria-label="Admin pages">
        <h2>Sections</h2>
        <p>
          <Link to={"/admin/user/"}>Users</Link>
        </p>
        <p>
          <Link to={"/admin/event/"}>Events</Link>
        </p>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
