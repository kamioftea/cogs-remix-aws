import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) return redirect("/account/login");
  return json({});
};

export default function AccountIndexPage() {
  const user = useUser();

  return <p>You are logged in as {user.email}</p>;
}
