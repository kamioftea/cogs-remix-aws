import { Link, Outlet } from "@remix-run/react";
import stylesheetUrl from "../styles/admin.css";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { Role } from "~/account/user-model.server";

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
      <header>
        <h1>Admin</h1>
      </header>
      <nav className="admin-sidebar" aria-label="Admin pages">
        <h2>Sections</h2>
        <Link to={"/admin/user/"}>Users</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
