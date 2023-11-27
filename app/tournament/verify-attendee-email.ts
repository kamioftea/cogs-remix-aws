import type { Email } from "~/utils/send-email.server";
import type { Attendee } from "./attendee-model.server";
import type { Tournament } from "~/tournament/tournament-model.server";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export class VerifyAttendeeEmail implements Email {
  html: string;
  subject: string;
  to: string[];

  constructor(
    name: Attendee["name"],
    email: Attendee["email"],
    eventSlug: Attendee["eventSlug"],
    tournamentTitle: Tournament["title"],
    accessKey: string
  ) {
    this.subject = `Thank you for signing up for ${tournamentTitle}.`;

    const verifyURL = new URL(`${BASE_URL}/event/${eventSlug}/verify`);
    verifyURL.searchParams.set("token", accessKey);

    this.html = `
      <p>Hi ${name}</p>
      <p>
          You are recieving this because someone signed up for 
          ${tournamentTitle} at Chesterfield Open Gaming Society.
      </p>
      <p>
          If this was you, please 
          <a href="${verifyURL}">verify your email by following this link</a>. 
          If it wasn't, you can ignore this email.
      </p>
      <p>
          Thanks, and welcome,<br />
          Chesterfield Open Gaming Society.
      </p>
    `;

    this.to = [email];
  }
}
