export enum Role {
  Admin = "Admin",
  Registered = "Registered",
}

export type User = {
  email: string;
  name?: string;
  roles?: Role[];
};
