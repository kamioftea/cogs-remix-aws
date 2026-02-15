import type { Breadcrumb } from "~/utils/breadcrumbs";
import { Outlet } from "@remix-run/react";

const breadcrumbs: Breadcrumb[] = [{ label: "Games" }];

export const handle = {
  breadcrumbs,
};

export default function Games() {
  return <Outlet />;
}
