import { armyListField } from "~/tournament/ArmyListField";
import { ReactNode } from "react";
import type { Attendee } from "~/tournament/attendee-model.server";

export interface AdditionalField {
  input: (
    name: string,
    value: string,
    eventSlug: string,
    attendeeSlug: string
  ) => ReactNode;
  profile: (value: string, attendee: Attendee) => ReactNode;
}

export type AdditionalFieldType = "ARMY_LIST";

export const additionalFieldTypes: Record<
  AdditionalFieldType,
  AdditionalField
> = {
  ARMY_LIST: armyListField,
};
