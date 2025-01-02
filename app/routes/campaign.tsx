import type { Breadcrumb } from "~/utils/breadcrumbs";
import { Outlet } from "@remix-run/react";

const breadcrumbs: Breadcrumb[] = [{ label: "Campaigns" }];

export const handle = { breadcrumbs };

export default function CampaignPage() {
  return <Outlet />;
}
