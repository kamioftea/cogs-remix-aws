import { Breadcrumb } from "~/utils/breadcrumbs";
import { Outlet } from "@remix-run/react";

const breadcrumbs: Breadcrumb[] = [{ label: "Events" }];

export const handle = { breadcrumbs };

export default function EventPage() {
  return <Outlet />;
}
