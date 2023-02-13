import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUser } from "~/account/session.server";
import { getUsers } from "~/account/user-model.server";
import { useLoaderData } from "@remix-run/react";
import type { User } from "~/account/user-model";
import { Role } from "~/account/user-model";
import type { ReactNode } from "react";

interface LoaderData {
  users: User[];
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request, [Role.Admin]);
  return json<LoaderData>({ users: await getUsers() });
};

function getApprovalLink(user: User): ReactNode {
  if (user?.roles?.includes(Role.Registered)) return null;

  return (
    <form action={`/admin/user/${user.email}/approve`} method="post">
      <button type="submit" className="button clear link display-inline">
        Approve
      </button>
    </form>
  );
}

export default function UserAdminPage() {
  const { users } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {(user.roles ?? []).map((role) => (
                  <span key={role} className="badge">
                    {role}
                  </span>
                ))}
              </td>
              <td>{getApprovalLink(user)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
