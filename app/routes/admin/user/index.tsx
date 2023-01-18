import { json, LoaderFunction } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { getUsers, Role, User } from "~/account/user-model.server";
import { useLoaderData } from "@remix-run/react";

interface LoaderData {
  users: User[];
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request, [Role.Admin]);
  return json<LoaderData>({ users: await getUsers() });
};

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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
