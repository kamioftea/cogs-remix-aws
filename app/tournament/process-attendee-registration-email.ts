import type { Email } from "~/utils/send-email.server";
import { Attendee } from "~/tournament/attendee-model.server";
import { Tournament } from "~/tournament/tournament-model.server";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "changeme@example.org";

export class ProcessAttendeeRegistrationEmail implements Email {
  html: string;
  subject: string;
  to: string[];

  constructor(
    name: Attendee["name"],
    email: Attendee["email"],
    slug: Tournament["slug"],
    title: Tournament["title"]
  ) {
    this.subject = `${name}<${email}> has registered for ${title}.`;

    const processURL = new URL(`${BASE_URL}/admin/event/${slug}/attendees`);

    this.html = `<p>
      You now need to <a href="${processURL}">process this request</a>.
    </p>`;

    this.to = [ADMIN_EMAIL];
  }
}
