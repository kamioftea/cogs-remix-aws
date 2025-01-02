import type { Email } from "~/utils/send-email.server";
import type { Attendee } from "./attendee-model.server";
import type { Tournament } from "~/tournament/tournament-model.server";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export class EditAttendeeDetailsEmail implements Email {
  html: string;
  subject: string;
  to: string[];

  constructor(
    name: Attendee["name"],
    email: Attendee["email"],
    eventSlug: Attendee["eventSlug"],
    tournamentTitle: Tournament["title"],
    accessKey: string,
  ) {
    this.subject = `Link to edit your details for ${tournamentTitle}.`;

    const verifyURL = new URL(
      `${BASE_URL}/event/${eventSlug}/login-as-attendee`,
    );
    verifyURL.searchParams.set("token", accessKey);

    this.html = `
      <p>Hi ${name}</p>
      <p>
          You are recieving this because someone requested a link to amend your
          attendee details for ${tournamentTitle} at Chesterfield Open Gaming
          Society.
      </p>
      <p>
          If this was you, you can  
          <a href="${verifyURL}">edit your details by following this link</a>. 
          If it wasn't, you can ignore this email.
      </p>
      <p>
          Thanks,<br />
          Chesterfield Open Gaming Society.
      </p>
    `;

    this.to = [email];
  }
}
