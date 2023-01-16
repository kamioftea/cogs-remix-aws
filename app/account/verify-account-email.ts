import { Email } from "~/utils/send-email.server";
import { User } from "./user-model.server";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export class VerifyAccountEmail implements Email {
  html: string;
  subject: string;
  to: string[];

  constructor(
    name: User["name"],
    email: User["email"],
    resetKey: string,
    event?: string
  ) {
    this.subject = `Thank you for signing up for ${
      event ?? "COGs Kings of War"
    }.`;

    const verifyURL = new URL(`${BASE_URL}/user/verify/`);
    verifyURL.searchParams.set("token", resetKey);

    this.html = `
<p>Hi ${name}</p>
<p>
    You are recieving this because you (or someone pretending to be you) signed up for ${
      event ?? "Kings of War"
    } at 
    Chesterfield Open Gaming Society,
</p>
<p>
    If this was you, please <a href="${verifyURL}">verify your email by following this link</a>. If it wasn't, you can 
    ignore this email,
</p>
<p>
    Thanks, and welcome,<br />
    Chesterfield Open Gaming Society.
</p>
`;
    this.to = [email];
  }
}
