import type { Breadcrumb } from "~/utils/breadcrumbs";
import { Outlet } from "@remix-run/react";

const breadcrumbs: Breadcrumb[] = [{ label: "Profile" }];

export const handle = { breadcrumbs };

export default function ProfilePage() {
  return <Outlet />;
}
