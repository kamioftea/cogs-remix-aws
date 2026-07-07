import type {ActionFunction, LoaderFunction} from "@remix-run/router";
import {redirect} from "@remix-run/router";
import {putUser, getUserByEmail} from "~/account/user-model.server";
import invariant from "tiny-invariant";
import {useLoaderData} from "@remix-run/react";
import {getUser} from "~/account/session.server";
import type { User} from "~/account/user-model";
import {Role} from "~/account/user-model";
import {json} from "@remix-run/node";
import FormCheckbox from "~/form/checkbox";

type LoaderData = {
  user: User,
  roles: typeof Role
}

export const action: ActionFunction = async ({ request, params }) => {
  const { email } = params;
  invariant(email, "From route");
  
  const formData = await request.formData();
  const roles = formData.getAll("roles") as Role[];
  
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  
  try {
    await putUser({...user, roles});
  } catch (err) {
    throw new Response("Event attendee not found", { status: 404 });
  }
  
  return redirect(`/admin/user`);
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { email } = params;
  invariant(email, "From route");
  const currentUser = await getUser(request);
  invariant(currentUser, "Not reachable if not admin user logged in")
  
  if(currentUser.email === email) {
    return redirect(`/admin/user`);
  }
  
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  
  return json<LoaderData>({user, roles: Role});
}

export default function ManageRolesPage() {
  const { user, roles } = useLoaderData<LoaderData>();
  
  return <>
    <h1>Update roles for {user.name ?? ''}?</h1>
    <form method="POST">
      {
        Object.entries(roles).map(([label, value]) =>
          <FormCheckbox
            key={value}
            label={label}
            id={`role-${value}`}
            name={'roles'}
            checkedValue={value}
            defaultChecked={(user.roles ?? []).includes(value)}
          />
        )
      }
      <button type="submit" className="button alert" name="submit" value={"update"}>
        Update roles
      </button>
    </form>
    <a href="../">Cancel</a>
  </>
}
