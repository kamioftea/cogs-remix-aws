import type { Email } from "~/utils/send-email.server";
import type { User } from "~/account/user-model";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export class ResetPasswordEmail implements Email {
  html: string;
  subject: string;
  to: string[];

  constructor(name: User["name"], email: User["email"], resetKey: string) {
    this.subject = `Reset password for COGS account.`;

    const verifyURL = new URL(`${BASE_URL}/account/verify/`);
    verifyURL.searchParams.set("token", resetKey);

    this.html = `
      <p>Hi ${name}</p>
      <p>
          You are recieving this because someone requested a password reset for 
          your account at Chesterfield Open Gaming Society.
      </p>
      <p>
          If this was you, <a href="${verifyURL}">reset your password by 
          following this link</a>. If it wasn't, you can ignore this email.
      </p>
      <p>
          Thanks,<br />
          Chesterfield Open Gaming Society.
      </p>
    `;
    this.to = [email];
  }
}
