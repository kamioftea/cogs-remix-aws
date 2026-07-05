import type {ActionFunction, LoaderFunction} from "@remix-run/router";
import {redirect} from "@remix-run/router";
import {deleteUser} from "~/account/user-model.server";
import invariant from "tiny-invariant";
import {useParams} from "@remix-run/react";
import {getUser} from "~/account/session.server";

export const action: ActionFunction = async ({ params }) => {
  const { email } = params;
  invariant(email, "From route");
  
  try {
    await deleteUser(email);
  } catch (err) {
    throw new Response("Event attendee not found", { status: 404 });
  }

  return redirect(`/admin/user`);
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { email } = params;
  invariant(email, "From route");
  const user = await getUser(request);
  invariant(user, "Not reachable if not admin user logged in")
  
  if(user.email === email) {
    return redirect(`/admin/user`);
  }
  
  return;
}

export default function DeleteUserPage() {
  const { email } = useParams();
  
  return <>
    <h1>Delete {email ?? ''}?</h1>
    <form method="POST">
      <legend>
        Are you sure you want to delete this user?
      </legend>
      <button type="submit" className="button alert">
        Confirm
      </button>
    </form>
    <a href="../">Cancel</a>
  </>
}
