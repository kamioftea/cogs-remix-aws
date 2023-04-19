import type { LoaderFunction } from "@remix-run/router";
import { redirect } from "@remix-run/router";

export const loader: LoaderFunction = ({ params }) => {
  return redirect(`/event/${params.eventId}/pack`);
};
