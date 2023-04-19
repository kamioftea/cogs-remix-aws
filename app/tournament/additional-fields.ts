import { armyListField } from "~/tournament/army-list-field";
import { ReactNode } from "react";
import type { Attendee } from "~/tournament/attendee-model.server";
import { scoreField } from "~/tournament/score-field";
import { stringField } from "~/tournament/string-field";

export interface AdditionalField {
  input: (
    name: string,
    value: string,
    eventSlug: string,
    attendeeSlug: string
  ) => ReactNode;
  profile: (value: string, attendee: Attendee) => ReactNode;
}

export type AdditionalFieldType = "ARMY_LIST" | "SCORE" | "STRING";

export const additionalFieldTypes: Record<
  AdditionalFieldType,
  AdditionalField
> = {
  ARMY_LIST: armyListField,
  SCORE: scoreField,
  STRING: stringField,
};
