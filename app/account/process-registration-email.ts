import type { Email } from "~/utils/send-email.server";
import type { User } from "~/account/user-model";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "changeme@example.org";

export class ProcessRegistrationEmail implements Email {
  html: string;
  subject: string;
  to: string[];

  constructor(name: User["name"], email: User["email"]) {
    this.subject = `${name}<${email}> has registered for COGS Kings of War.`;

    const processURL = new URL(
      `${BASE_URL}/admin/users/process-registration/${email}`,
    );

    this.html = `<p>
      You now need to <a href="${processURL}">process this request</a>.
    </p>`;

    this.to = [ADMIN_EMAIL];
  }
}
