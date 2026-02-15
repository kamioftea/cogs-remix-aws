import type { Breadcrumb } from "~/utils/breadcrumbs";
import { CURRENT } from "~/utils/breadcrumbs";
import { Outlet } from "@remix-run/react";

const breadcrumbs: Breadcrumb[] = [
  {
    label: "Players",
    url: CURRENT,
  },
];

export const handle = {
  breadcrumbs,
};

export default function Players() {
  return <Outlet />;
}
