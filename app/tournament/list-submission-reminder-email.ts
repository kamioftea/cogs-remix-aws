import type { Email } from "~/utils/send-email.server";
import type { Attendee } from "./attendee-model.server";
import type { Tournament } from "~/tournament/tournament-model.server";
import { ADMIN_EMAIL } from "~/account/user-model.server";
import type {Defined} from "yup";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar)

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export class ListSubmissionReminderEmail implements Email {
  html: string;
  subject: string;
  to: string[];

  constructor(
    name: Attendee["name"],
    email: Attendee["email"],
    eventSlug: Attendee["eventSlug"],
    tournamentTitle: Tournament["title"],
    tournamentDate: Tournament["date"],
    listSubmissionDeadline: Defined<Tournament["listSubmissionDeadline"]>,
    accessKey: string,
  ) {
    this.subject = `${tournamentTitle} list submission reminder.`;

    const verifyURL = new URL(
      `${BASE_URL}/event/${eventSlug}/login-as-attendee`,
    );
    verifyURL.searchParams.set("token", accessKey);

    this.html = `
      <p>Hi ${name},</p>
      <p>
          A quick reminder that you're signed up to Cogs of War on
          ${tournamentDate?.format("D MMMM YYYY")}, and that lists should be
          submitted by ${listSubmissionDeadline.calendar()}.
      </p>
      <p>Apologies for the previous email that had the submission deadline a day earlier.</p>
      <p>
          You can:
          <ul>
            <li><a href="${verifyURL}">Upload your list on the website</a></li>
            <li><a href="mailto:${ADMIN_EMAIL}">Email me with your list</a></li>
          </ul>
      </p>
      <p>
          Thanks,<br />
          Chesterfield Open Gaming Society.
      </p>
    `;

    this.to = [email];
  }
}
